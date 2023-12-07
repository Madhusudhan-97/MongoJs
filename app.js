const express = require('express');
const bodyParser = require('body-parser');
const  MongoClient  = require('mongodb').MongoClient;
const ObjectId = require('mongodb').ObjectId;
const router = express.Router();
const app = express();
app.use(bodyParser.json())
const mongoURI = require('./secret');

MongoClient.connect(mongoURI)
  .then(client => {
    console.log('Ready');
    const myDb = client.db('people').collection('friends');
    app.get('/user/:name',(req,res)=>{
        console.log(req.params);
        myDb.find(req.params).toArray().then(results=>{
            console.log(JSON.stringify(results));
            res.contentType('application/json')
            res.send(JSON.stringify(results))
        })
    })
    app.route('/users')
    .get((req,res)=>{
        myDb.find().toArray().then(results=>{
            console.log(JSON.stringify(results));
            res.contentType('application/json')
            res.send(JSON.stringify(results))
        })
    })
    .post((req,res)=>{
        console.log(req.body);
        myDb.insertOne(req.body).then(results=>{
            console.log(req.body);
            res.contentType('application/json')
            res.send(JSON.stringify(req.body))
        })
    })
    .put((req,res)=>{
        console.log(req.body);
        myDb.findOneAndUpdate({_id: new ObjectId(req.body._id)},{
            $set:{
                name:req.body.name
            }
        },{
            upsert:false
        }).then(results=>{
            res.contentType('application/json')
            res.send({"status":true})
        })
    })
    .delete((req,res)=>{
        console.log(req.body);
        myDb.deleteOne({_id: new ObjectId(req.body._id)})
        .then(results=>{
            let boo = true;
            if(results.deletedCount===0){
                boo:false;
            }
            res.send({"status":boo})
        })
        .catch(error=>console.log(error))
    })
  })
  .catch(err => console.error('MongoDB connection error:', err));

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/public/index.html');
});

app.listen(8080, () => {
  console.log('Server ready');
});



