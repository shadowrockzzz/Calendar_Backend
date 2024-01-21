const express = require('express')
const cors = require('cors');
const mongoose = require('mongoose');
const bodyParser = require('body-parser')
const routes = require('./routes/userRoutes');


const app = express()

const PORT = 3030

app.use(cors())
app.use(bodyParser.json())
app.use('/api', routes);

const db = mongoose.connection;

db.on('error', console.error.bind(console, 'MongoDB connection error:'));
db.once('open', () => {
  console.log('Connected to MongoDB');
});

mongoose.connect("mongodb+srv://vssnreddy1:VSSNReddy123@cluster0.z5eib2e.mongodb.net/",{
    useNewUrlParser: true,
    useUnifiedTopology: true,
})

app.get('/',(req,res)=>{res.json('My app is running...')})

app.listen(PORT, console.log('App is listening on '+ PORT))