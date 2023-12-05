const express = require("express");
const router = express.Router();
const Blog = require("../schema/blog");
const User = require("../schema/user")
const cloudinary = require("../utils/cloudinary");
const upload = require("../utils/multer");

router.get("/", async (req, res) => {
  try {
    const allBlogs = await Blog.find();
    res.status(200).json(allBlogs);
  } catch (error) {
    res.status(500).json(error);
  }
});

router.post("/create", upload.single("img"), async (req, res) => {
  try {
    const image = await cloudinary.uploader.upload(req.file.path);
    const { author, title, content } = req.body;
    const user = await User.findById(author)
    if(!user){
      return res.status(404).json({msg:"user not found"})
    }
    const blog = await Blog.create({
      author: author,
      title: title,
      content: content,
      thumbNail: image.secure_url,
    });
    res.status(201).json({
      msg: "blog created successfully",
    });
  } catch (error) {
    res.status(500).json(error);
  }
});

router.delete("/delete", async (req, res) => {
  try {
    const { authorId, blogId } = req.body;
    const blog = await Blog.find({ author: authorId, _id: blogId });
    if (!blog) {
      return res.status(404).json({ msg: "no blog with this author" });
    }
    let removeBlog = await Blog.findOneAndDelete(
      { author: authorId, _id: blogId },
      {
        new: true,
      }
    );
    res.status(201).json({
      msg: "blog deleted successfully",
    });
  } catch (error) {
    res.status(500).json(error);
  }
});

router.get("/:id", async (req, res) => {
  try {
    const authorId = req.params.id;
    const myBlogs = await Blog.find({ author: authorId });
    if (!myBlogs) {
      return res.status(404).json({ msg: "no blogs posted with this author" });
    }
    res.status(200).json(myBlogs);
  } catch (error) {
    res.status(500).json(error);
  }
});

router.patch("/update", upload.single("img"), async (req, res) => {
  try {
    const image = await cloudinary.uploader.upload(req.file.path);
    const { authorId, blogId, title, content } = req.body;
    const blog = await Blog.find({ author: authorId, _id: blogId });
    if (!blog) {
      return res.status(404).json({ msg: "no blog with this title" });
    }
    let updateBlog = await Blog.findOneAndUpdate(
      { author: authorId, _id: blogId },
      {
        title: title,
        content: content,
        image: image.secure_url,
      },
      {
        new: true,
      }
    );
    res.status(201).json({
      msg: "blog updated successfully",
    });
  } catch (error) {
    res.status(500).json(error);
  }
});

module.exports = router;
