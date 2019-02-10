const mongoose = require ('mongoose');

mongoose.connect('mongodb://localhost:27017/users', {useNewUrlParser:true}, (err) => {
    if (!err)
        console.log('Database is connected successfully')
    else
        console.log('Error in DB connection :' +JSON.stringify(err, undefined,2))
});

module.exports = mongoose;
