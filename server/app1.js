const express = require('express')
const morgan = require('morgan')
const mongoose = require('mongoose')
const bodyParser = require('body-parser')
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
const es = require('event-stream');
const apiRoute = require('./api/index')

//swagger-ui
const swaggerUi = require('swagger-ui-express');
const YAML = require('yamljs');
const swaggerDocument = YAML.load('./swagger.yaml');

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

//Middleware ...
app.use(bodyParser.urlencoded({extended:true}))
app.use(bodyParser.json())
app.use(morgan('combined'))

//mongodb...
mongoose.connect("mongodb://admin:password@localhost:27017/cms?authSource=admin", {
  useNewUrlParser: "true",
})
mongoose.connection.on("error", err => {
  console.log("err", err)
})
mongoose.connection.on("connected", (err, res) => {
  console.log("Docker mongoDB is connected")
})

app.use('/api/v1', apiRoute)
// app.post("/api/v1/upload_files", upload.array("files"), uploadFiles);

// function uploadFiles(req, res) {
//     // fs.readFile('./uploads/convertcsv.csv', 'utf-8', (err, data) => {
//     //   if(err) { throw err; }
//     //   console.log('data: ', data);
//     // });
//     fs.createReadStream('./uploads/convertcsv.csv')
//     .pipe(es.split())
//     .on('data', (row) => {
//       console.log({row})
//       // console.log({
//       //   fruits: row.toString().split(',').map((fruit) => {
//       //     return {
//       //       name: fruit.trim()
//       //     }
//       //   })
//       // });
// });
//     res.json({ message: "Successfully uploaded files" });
// }
// app.get('/api/v1/lco', (req,res) => {
//   const arr =[
//     {
//       name:"Node Js",
//       desc: "Backend developement"
//     },
//     {
//       name:"Django",
//       desc: "Backend developement"
//     },
//     {
//       name:"React Js",
//       desc: "FrontEnd developement"
//     },
//     {
//       name:"Angular Js",
//       desc: "FrontEnd developement"
//     },
//     {
//       name:"React Native",
//       desc: "Mobile Hybrid developement"
//     }
//   ]
//   res.status(200).send({data:arr})
// })

app.listen(port,() => console.log(`Server Listening on Port: ${port}`))