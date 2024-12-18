var express = require('express');
var router = express.Router();
const { ObjectId } = require('mongodb');

/* GET users listing. */
router.get('/', async function(req, res, next) {
//   res.send('respond with a resource');
  try {
    const db = req.app.locals.db;

    // const posts = await db.collection('posts')
    //   .find()
    //   .toArray();
    // console.log(posts);
    const posts = await db.collection('memories')
      .aggregate ([
        {
          $lookup: {
            from: 'comments',
            foreignField: 'postID',
            localField: '_id',
            as: 'comments'
          }
        },
        { $sort: {createdAt: -1 }}
      ])
      .toArray();
    console.log(memories);

    res.render('index', { title: 'Memories', memories: memories });
    } catch (error) {
      console.log(error);
    }
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

//post comments section


router.put('/', async function (req, res) {
    console.log('MAKING PUT REQUEST')
    console.log(req.body);
    try{
        const db = req.app.locals.db;

        await db.collection('memories')
            .updateOne({ _id: new ObjectId(req.body.memoryID) }, { $set: {title: req.body.title, description: req.body.description, date: req.body.date}})
        res.send('successfully updated')
    } catch(error){
        console.log(error);
    }
})

router.delete('/:id', async function (req, res) {
    console.log(req.params.id);
    try{
        const db = req.app.locals.db;
        await db.collection('memories')
            .deleteOne({ _id: new ObjectId(req.params.id) })
        res.send('successfully deleted')
    }catch(error){
        console.log(error);
    }
})

module.exports = router;