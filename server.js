const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const MongoClient = require('mongodb').MongoClient

var db, collection;

const url = "mongodb+srv://ahachey17:ABC123@expressprevapp.io5elr3.mongodb.net/?retryWrites=true&w=majority";
const dbName = "expressprevapp";

app.listen(4000, () => {
    MongoClient.connect(url, { useNewUrlParser: true, useUnifiedTopology: true }, (error, client) => {
        if(error) {
            throw error;
        }
        db = client.db(dbName);
        console.log("Connected to `" + dbName + "`!");
    });
});

app.set('view engine', 'ejs')
app.use(bodyParser.urlencoded({extended: true}))
app.use(bodyParser.json())
app.use(express.static('public'))
//everything above boiler plate
app.get('/', (req, res) => {
  //go into db college get messgaes in an array
  db.collection('messages').find().toArray((err, result) => {
    if (err) return console.log(err)
    //pass messages into index.ejs:
    res.render('index.ejs', {messages: result})
  })
})

//w.e stored in req input we get the doc that has body na
app.post('/messages', (req, res) => {
  db.collection('messages').insertOne({date: req.body.date, msg: req.body.msg, thumbUp: 0, thumbDown:0, completed:'notDone'}, (err, result) => {
    if (err) return console.log(err)
    console.log('saved to database')
    //sent something to database, to retrieve get request then refresh:
    res.redirect('/')
  })
})



app.put('/messages/thumbUp', (req, res) => {
  db.collection('messages')
  .findOneAndUpdate({date: req.body.date, msg: req.body.msg}, {
    $set: {
      completed:'completed'
    }
  }, {
    sort: {_id: -1},
    upsert: true
  }, (err, result) => {
    if (err) return res.send(err)
    res.send(result)
  })
})

app.put('/messages/thumbDown', (req, res) => {
  db.collection('messages')
  .findOneAndUpdate({date: req.body.date, msg: req.body.msg}, {
    $set: {
      completed:'notDone'
    }
  }, {
    sort: {_id: -1},
    upsert: true
  }, (err, result) => {
    if (err) return res.send(err)
    res.send(result)
  })
})

app.delete('/messages', (req, res) => {
  db.collection('messages').findOneAndDelete({date: req.body.date, msg: req.body.msg}, (err, result) => {
    if (err) return res.send(500, err)
    res.send('Message deleted!')
  })
})
