const express = require("express");
const router = express.Router();
const User = require("../schema/user");

router.post("/register", async (req, res) => {
  try {
    const user = await User.findById(req.body._id);
    if (!user) {
      return res.status(404).json({ msg: "no user with this id" });
    }
    user.event.push(req.body.event);
    let eventUpdate = await User.findOneAndUpdate(
      { _id: req.body._id },
      { event: user.event },
      {
        new: true,
      }
    );
    res.status(201).json({
      msg: "event created successfully",
    });
  } catch (error) {
    res.status(500).json({ error: error });
  }
});

router.get("/:id", (req, res) => {
  User.findById(req.params.id)
    .then((info) => {
      if (info.event == []) {
        return res.status(404).json({ msg: "no events found" });
      }
      res.status(200).send(info.event);
    })
    .catch((error) => {
      res.status(500).json({
        error: error,
      });
    });
});

router.delete("/delete", async (req, res) => {
  try {
    const user = await User.findById(req.body.userId);
    if (!user) {
      return res.status(404).json({ msg: "no user with this id" });
    }
    const updatedEvents = await user.event.filter(
      (item) => item._id.toString() !== req.body.eventId
    );
    let Update = await User.findOneAndUpdate(
      { _id: req.body.userId },
      { event: updatedEvents },
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

router.get("/", (req, res) => {
  User.find()
    .then((users) => {
      const allEvents = [].concat(...users.map((user) => user.event));
      res.status(200).json(allEvents);
    })
    .catch((error) => {
      res.status(500).json({
        error: error,
      });
    });
});

module.exports = router;
