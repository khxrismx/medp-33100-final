var express = require('express');
var router = express.Router();

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

//create new memory
router.post('/', async function(req, res) {
    console.log(req.body);

    try{
        const db = req.app.locals.db;
        const newMemory = {
            title: req.body.title, 
            date: new Date(),
            description: req.body.description,
            author: req.body.author
        }
        await db.collection('memories')
            .insertOne(newMemory)
        res.send('successfully added memory');    
    } catch(error){
        console.log(error);
    }
    
});

router.put('/', async function (req, res) {
    console.log('MAKING PUT REQUEST')
    console.log(req.body);
})

module.exports = router;