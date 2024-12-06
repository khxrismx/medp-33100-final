var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', async function(req, res, next) {
  try{
    const db = req.app.locals.db;
    const memories = await db.collection('memories')
      .find()
      .toArray();
    console.log(memories);

    res.render('index', {title: 'Memories', memories: memories});
  }catch(error){
    console.log(error);
  }
});

module.exports = router;
