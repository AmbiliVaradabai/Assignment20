const express = require ('express');
const bodyparser = require('body-parser');
const usercontroller = require ('./controllers/usercontroller')
const cors = require('cors')

const app = express()
app.use(cors())

//setting up middleware
app.use(bodyparser.json())
app.use('/api',usercontroller)

//starting the server
port = process.env.port || 3000
app.listen(port, () => {
   console.log (`Server is runing in port ${port}`) 
})

