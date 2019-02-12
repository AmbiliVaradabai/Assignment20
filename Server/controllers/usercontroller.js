const express = require ('express');
const router = express.Router();
var  User = require ('../models/user');
var  FileUpload = require ('../models/file');
const path = require('path');
const mongoose = require('mongoose');
const multer = require('multer');
const fs = require('fs')

// Mongo URI
const mongoURI = 'mongodb://localhost:27017/UsersDB';

// Create mongo connection
const conn = mongoose.createConnection(mongoURI);

conn.once('open', () => {

  mongoose.connect(mongoURI, function(err){
    if(err){
        console.error('Error! ' + err)
    } else {
      console.log('Connected to mongodb')      
    }
  });

  router.post('/adduser', (req, res) => {
      let userData = req.body
      console.log(req.body)
      let user = new User(userData)

      user.save((err, registeredUser) => {
        if (err) {
          console.log(err)      
        } else {
          res.status(200).send(registeredUser)
        }
      })
  })
    
  router.get('/users', (req, res) => {
    User.find((err, docs) => {
      if (err) {
        console.log(err); 
      } else {
          res.status(200).send(docs);
      }
    })
  });

  //Multer file storage
  var storage = multer.diskStorage({
      destination:function(req,file,cb){
          cb(null, './uploads');
      },
      filename:function(req,file,cb){
          cb(null, Date.now()+'.'+file.originalname); 
      }
  });

  //Upload file
  router.post('/uploads', multer({storage: storage, dest: './uploads/'}).single('file'),function(req,res){
      console.log(req.file)
      var fileupload = new FileUpload ({
      fieldname: req.file.fieldname,
      originalname: req.file.originalname,
      encoding: req.file.encoding,
      mimetype: req.file.mimetype,
      destination:req.file.destination,
      filename: req.file.filename,
      path: req.file.path,
      size: req.file.size,
      description: req.body.description
      })

      console.log(fileupload)
      fileupload.save(function(err,filedata){
          if (err){console.log(err)}
          else {
              res.send(filedata)
          }
        })
  });

  //Download file
  router.post('/download', function(req,res,next){
      filepath = path.join(__dirname,'../uploads') +'/'+ req.body.filename;
      res.sendFile(filepath);

  });

  // @route GET /files
  router.get('/uploads', (req, res) => {
      FileUpload.find((err, docs) => {
          if (err) {
            console.log(err); 
          } else {
              res.status(200).send(docs);
          }
        })  
  });

  // Delete a file from MongoDB
  router.get('/uploads/:filename', (req, res) => {
    var filename = req.params.filename;
    FileUpload.remove({ filename: filename }, (err) => {
      if (err) res.status(500).send(err);
      res.json({status: 'File Deleted'});
    });
    });

});

module.exports = router;