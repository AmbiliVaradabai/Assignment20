var mongoose = require('mongoose');

var FileUploadSchema = new mongoose.Schema({
  fieldname: String,
  originalname: String,
  encoding: String,
  mimetype: String,
  destination: String,
  filename: String,
  path: String,
  size: Number,
  created_at: Date,
  updated_at: Date,
  description: String 
});
var FileUpload = mongoose.model('uploads', FileUploadSchema);

module.exports = FileUpload;