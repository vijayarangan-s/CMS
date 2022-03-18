const express = require('express')
const morgan = require('morgan')
const mongoose = require('mongoose')
const bodyParser = require('body-parser')
const passport = require('passport')
const app = express()
const port = process.env.PORT || 3300
const multer = require("multer");
var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, './uploads/')
  },
  filename: function (req, file, cb) {

      cb(null,  file.originalname );

  }
});
const upload = multer({ storage: storage });
const fs = require('fs');
const apiRoute = require('./api/index')
const passportConfig = require('./utils/passport')
const cookieSession = require('cookie-session')
var session = require('express-session')

//swagger-ui
const swaggerUi = require('swagger-ui-express');
const YAML = require('yamljs');
const swaggerDocument = YAML.load('./swagger.yaml');

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

//Middleware ...
app.use(bodyParser.urlencoded({extended:true}))
app.use(bodyParser.json())
app.use(morgan('dev'))

// app.use(passport.initialize());
// app.use(passport.session());

app.use(cookieSession({
  maxAge: 3 * 24 * 60 * 60 * 1000,
  keys: ['passportekey'],

}))
  // required for passport
  // app.use(express.session({ secret: 'SECRET' })); // session secret
  app.use(passport.initialize());
  app.use(passport.session()); // persistent login sessions

// app.use(session({
//   secret: 'keyboard cat',
//   resave: false,
//   saveUninitialized: true,
//   cookie: { secure: true }
// }))

// app.use(session(sess))

//mongodb...
mongoose.connect("mongodb://admin:password@localhost:27017/cms?authSource=admin", {
  useNewUrlParser: true,
  useUnifiedTopology: true 
})

mongoose.connection.on("error", err => {
  console.log("err", err)
})

mongoose.connection.on("connected", (err, res) => {
  console.log("Docker mongoDB is connected")
})

app.get('/',(req,res) => {
  res.send(`
    <a href="/api/v1/auth/google"> Google</a>
  `)
})

app.use('/api/v1', apiRoute)

app.listen(port,() => console.log(`Server Listening on Port: ${port}`))