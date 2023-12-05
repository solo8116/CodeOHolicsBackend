// routes already in event.js

const express = require("express");
const router = express.Router();
const Event = require("../schema/event");
const User = require("../schema/user");

router.put("/join", async (req, res) => {
  try {
    const { userId, eventId } = req.body;
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
    const join = await event.joinedUsers.push(userId);
    const update = Event.findOneAndUpdate({ _id: eventId }, event, {
      new: true,
    });
    res.status(201).json({ msg: "user joined the event successfully" });
  } catch (error) {
    res.status(500).json(error);
  }
});

router.get("/:id/joinedEvents", async (req, res) => {
  try {
    const userId = req.params.id;
    const user = User.findById(userId);
    const joinedEvents = {};
    if (!user) {
      return res.status(404).json({ msg: "no user with this id" });
    }
    const allEvents = await Event.find({});
    const findEvents = allEvents.map((event) => {
      if (event.joinedUsers.includes(userId)) {
        joinedEvents += event;
      }
    });
    res.status(200).json(joinedEvents);
  } catch (error) {
    res.status(500).json(error);
  }
});

router.delete("/:id/leave", async (req, res) => {
  try {
    const userId = req.body.userId;
    const eventId = req.params.id
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ msg: "no user with this id" });
    }
    const event = await Event.findById(eventId);
    if (!event) {
      res.status(404).json({ msg: "no event with this id" });
    }
    const joinedUsers = await event.joinedUsers.filter(
      (users) => users != userId
    );
    const leaveEvent = await Event.findOneAndUpdate(
      { _id: eventId },
      { joinedUsers},
      { new: true }
    );
    res.status(201).json({ msg: "leaved the event" });
  } catch (error) {
    res.status(500).json(error);
  }
});

module.exports = router;
