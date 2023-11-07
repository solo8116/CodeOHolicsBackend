const express = require("express");
const router = express.Router();
const Blog = require("../schema/blog");

router.get("/", (req, res) => {
  Blog.find()
    .then((allBlogs) => {
      res.status(200).json(allBlogs)
    })
    .catch((err) => {
      res.status(500).json({ error: err });
    });
});

router.post("/create", async (req, res) => {
  try {
    const blog = await Blog.create(req.body.blog) //{blog:{iske andar likhna schema ke hisabse}}
    res.status(201).json({
      msg: "blog created successfully",
    });
  } catch (error) {
    res.status(500).json({ error: error });
  }
});

router.delete("/delete", async (req, res) => {
    try {
      const blog = await Blog.findById(req.body._id); //_id blog ki id h
      if (!blog) {
        return res.status(404).json({ msg: "no blog with this _id" });
      }
      let Update = await Blog.findOneAndDelete(
        {_id:req.body._id},
        {
          new: true,
        }
      );
      res.status(201).json({
        msg: "event deleted successfully",
      });
    } catch (error) {
      res.status(500).json({ error: error });
    }
  });

  router.patch("/update", async (req, res) => {
    try {
      const blog = await Blog.findById(req.body._id);  //_id blog ki id h
      if (!blog) {
        return res.status(404).json({ msg: "no blog with this title" });
      }
      let Update = await Blog.findOneAndUpdate(
        {_id:req.body._id},req.body.blog,
        {
          new: true,
        }
      );
      res.status(201).json({
        msg: "event updated successfully",
      });
    } catch (error) {
      res.status(500).json({ error: error });
    }
  });

module.exports = router;
