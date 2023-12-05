const express = require("express");
const router = express.Router();
const upload = require("../utils/multer");
const cloudinary = require("../utils/cloudinary");
const User = require("../schema/user");
const Event = require("../schema/event");

router.post("/register", upload.single("img"), async (req, res) => {
  try {
    const image = await cloudinary.uploader.upload(req.file.path);
    const { author, title, description, time } = req.body;
    const event = await Event.create({
      author: author,
      title: title,
      description: description,
      imageUrl: image.secure_url,
      time: time,
    });
    res.status(201).json({
      msg: "event created successfully",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json(error);
  }
});

router.get("/:id", async (req, res) => {
  const author = req.params.id;
  try {
    const myEvents = await Event.find({ author: author });
    if (!myEvents) {
      return res.status(404).json({ msg: "now event by this author" });
    }
    res.status(200).json(myEvents);
  } catch (error) {
    res.status(500).json(error);
  }
});

router.delete("/delete", async (req, res) => {
  try {
    const { authorId, eventId } = req.body;
    const event = await Event.find({ author: authorId, _id: eventId });
    if (!event) {
      return res.status(404).json({ msg: "no event by this author" });
    }
    const removeEvent = await Event.findOneAndDelete(
      { author: authorId, _id: eventId },
      {
        new: true,
      }
    );
    res.status(201).json({
      msg: "event deleted successfully",
    });
  } catch (error) {
    res.status(500).json(error);
  }
});

router.get("/", async (req, res) => {
  try {
    const allEvents = await Event.find({});
    res.status(200).json(allEvents);
  } catch (error) {
    res.status(500).json(error);
  }
});

router.patch("/edit", upload.single("img"), async (req, res) => {
  try {
    const image = await cloudinary.uploader.upload(req.file.path);
    const { eventId, authorId, title, description, time } = req.body;
    const updateEvent = await Event.findOneAndUpdate(
      { author: authorId, _id: eventId },
      {
        title: title,
        description: description,
        imageUrl: image.secure_url,
        time: time,
      },
      {
        new: true,
      }
    );
    res.status(201).json({
      msg: "event updated successfully",
    });
  } catch (error) {
    res.status(500).json(error);
  }
});

router.put("/:id/join", async (req, res) => {
  try {
    const userId = req.body.userId;
    const eventId = req.params.id;
    const event = await Event.findById(eventId);
    if (!event) {
      res.status(404).json({ msg: "no event with this id" });
    }
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ msg: "user not found" });
    }
    const alreadyJoined = await event.joinedUsers.includes(userId);
    if (alreadyJoined) {
      return res.status(400).json({ msg: "user has already joined the event" });
    }
    let joinedUsers = event.joinedUsers;
    const join = await joinedUsers.push(userId);
    const update = await Event.findOneAndUpdate(
      { _id: eventId },
      { joinedUsers },
      {
        new: true,
      }
    );
    res.status(201).json({ msg: "user joined the event successfully" });
  } catch (error) {
    res.status(500).json(error);
  }
});

router.get("/:id/joinedEvents", async (req, res) => {
  try {
    const userId = req.params.id;
    const user = User.findById(userId);
    if (!user) {
      return res.status(404).json({ msg: "no user with this id" });
    }
    const allEvents = await Event.find({});
    const findEvents = allEvents.filter((event) => {
      if (event.joinedUsers.includes(userId)) {
        return event;
      }
    });
    res.status(200).json(findEvents);
  } catch (error) {
    res.status(500).json(error);
  }
});

router.delete("/:id/leave", async (req, res) => {
  try {
    const userId = req.body.userId;
    const eventId = req.params.id;
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ msg: "no user with this id" });
    }
    const event = await Event.findById(eventId);
    if (!event) {
      res.status(404).json({ msg: "no event with this id" });
    }
    let joinedUsers =
      (await event.joinedUsers.filter((users) => users !== userId)) || [];
    const leaveEvent = await Event.findOneAndUpdate(
      { _id: eventId },
      { joinedUsers },
      { new: true }
    );
    res.status(201).json({ msg: "leaved the event" });
  } catch (error) {
    res.status(500).json(error);
  }
});

module.exports = router;
