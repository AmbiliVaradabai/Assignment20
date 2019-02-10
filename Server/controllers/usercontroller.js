const express = require ('express');
const router = express.Router();
var  User = require ('../models/user');
const path = require('path');
const crypto = require('crypto');
const mongoose = require('mongoose');
const multer = require('multer');
const GridFsStorage = require('multer-gridfs-storage');
const Grid = require('gridfs-stream');

// Mongo URI
const mongoURI = 'mongodb://localhost:27017/UsersDB';

// Create mongo connection
const conn = mongoose.createConnection(mongoURI);

// // Init gfs
// let gfs;

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


  // Init stream
  gfs = Grid(conn.db, mongoose.mongo);
  gfs.collection('uploads');

  
// Create storage engine
const storage = new GridFsStorage({
  url: mongoURI,
  file: (req, file) => {
    return new Promise((resolve, reject) => {
      crypto.randomBytes(16, (err, buf) => {
        if (err) {
          return reject(err);
        }
        //const filename = buf.toString('hex') + path.extname(file.originalname);
          const fileInfo = {
          filename: file.originalname,
          originalname: file.originalname,
          bucketName: 'uploads'
        };
        resolve(fileInfo);
      });
    });
  }
});

const upload = multer({ storage });

// @route POST /upload Uploads file to DB
router.post('/uploads', upload.single('file'), (req, res) => {
  res.json({ file: req.file });
  //res.redirect('/');
});

// @route GET /files
router.get('/uploads', (req, res) => {
  gfs.files.find().toArray((err, files) => {
    // Check if files
    if (!files || files.length === 0) {
      return res.status(404).json({
        err: 'No files exist'
      });
    }
    // Files exist
    return res.json(files);
  });
});

 // Download a file from MongoDB - then save to local file-system
router.get('/download', (req, res) => {
  // Check file exist on MongoDB
  var filename = req.query.filename;
  var readstream = gfs.createReadStream({ filename: filename });
  readstream.pipe(res);            
  //});
});

// @route GET /files/:_id Display single file object
router.get('/uploads/:files_id', (req, res) => {
  console.log(req.params.files_id)
  gfs.files.findOne({ files_id: req.params.files_id }, (err, file) => {
    // Check if file
    if (!file || file.length === 0) {
      return res.status(404).json({
        err: 'No file exists'
      });
    }
    // File exists
    return res.json(file);
  });
});


});



module.exports = router;