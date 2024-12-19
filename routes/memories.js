var express = require("express");
var router = express.Router();
const { ObjectId } = require("mongodb");
const uploadToCloudinary = require("../config/uploadToCloudinary");
const multer = require("multer");

/* GET users listing. */
router.get("/", async function (req, res, next) {
  //   res.send('respond with a resource');
  try {
    const db = req.app.locals.db;

    const emotionFilter = req.query.emotion || "all";

    let query = {};
    if (emotionFilter != "all") {
      //only fetch memories with the selected emotion
      query.emotion = emotionFilter;
    }


    // const posts = await db.collection('posts')
    //   .find()
    //   .toArray();
    // console.log(posts);
    // const posts = await db
    //   .collection("memories")
    //   .aggregate([
    //     {
    //       $lookup: {
    //         from: "comments",
    //         foreignField: "postID",
    //         localField: "_id",
    //         as: "comments",
    //       },
    //     },
    //     { $sort: { createdAt: -1 } },
    //   ])
    //   .toArray();

    // const memories = await db.collection("memories").find(query).toArray();
    // console.log(memories);

    const memories = await db.collection("memories").find(query).toArray();

    res.json(memories);

    // res.render("index", { title: "Memories", memories: memories });
  } catch (error) {
    console.log(error);
  }
});

//create new memory
router.post("/", multer().single("image"), uploadToCloudinary, async function (req, res) {
    console.log(req.file.cloudinaryUrl);

    try {
      const db = req.app.locals.db;

      // Format the current date and time
      const currentDate = new Date();
      const month = currentDate.getMonth() + 1;
      const day = currentDate.getDate();
      const year = currentDate.getFullYear();
      let hours = currentDate.getHours();
      let minutes = currentDate.getMinutes();
      const ampm = hours >= 12 ? "PM" : "AM";

      hours = hours % 12;
      hours = hours ? hours : 12;
      minutes = minutes < 10 ? "0" + minutes : minutes;

      const formattedDate = `${month}/${day}/${year} ${hours}:${minutes} ${ampm}`;

      console.log(req.body.emotion);
      const newMemory = {
        title: req.body.title,
        date: formattedDate,
        description: req.body.description,
        imageUrl: req.file.cloudinaryUrl,
        author: req.body.author,
        emotion: req.body.emotion,
      };

      await db.collection("memories").insertOne(newMemory);

      const memories = await db.collection("memories").find().toArray();
      res.json(memories);
    } catch (error) {
      console.log(error);
    }
  }
);

//post comments section

//edit
router.put("/", async function (req, res) {
  console.log("MAKING PUT REQUEST");
  console.log(req.body);
  try {
    const db = req.app.locals.db;

    await db.collection("memories").updateOne(
      { _id: new ObjectId(req.body.memoryID) },
      {
        $set: {
          title: req.body.title,
          description: req.body.description,
          date: req.body.date,
        },
      }
    );

    //fetch updated list of memories 
    const memories = await db.collection("memories").find().toArray();
    res.send(memories);
    res.send("successfully updated");
  } catch (error) {
    console.log(error);
  }
});

//delete
router.delete("/:id", async function (req, res) {
  console.log(req.params.id);
  try {
    const db = req.app.locals.db;
    await db
      .collection("memories")
      .deleteOne({ _id: new ObjectId(req.params.id) });
    
    const memories = await db.collection("memories").find().toArray();
    res.json(memories);
    res.send("successfully deleted");
  } catch (error) {
    console.log(error);
  }
});

module.exports = router;
