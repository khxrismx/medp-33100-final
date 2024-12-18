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

// Router for the second page
router.get('/page2', (req, res) => {
    res.render('page2', { title: 'Page 2' });
  });
module.exports = router;