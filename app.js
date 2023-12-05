const express = require('express')
const app = express();
const event = require('./routes/event')
const blog = require('./routes/blog')
require('dotenv').config()
const cors = require('cors')
const bodyParser = require('body-parser');

const mongoose= require('mongoose')
mongoose.connect(process.env.mongoDB_URI)
app.use(express.json());
app.use(cors())
app.use(bodyParser.urlencoded({ extended: true }));
app.use('/api/events',event)
app.use('/api/blogs',blog)

app.get('/hello',(req,res)=>{
    res.status(200).send('Hello')
})


const port = 3000;
app.listen(port);