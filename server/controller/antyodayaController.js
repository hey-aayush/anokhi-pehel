const Event = require("../models/Event");
const Participant = require("../models/AntyodayaParticipant");

const addParticipants = async (req, res) => {
  try {
    const { name, class: studentClass, phone, school, address, poc, events } = req.body;
    const eventList = events
      ? (Array.isArray(events) ? events : events.split(','))
        .map((id) => id.trim())
        .filter(Boolean)
      : [];

    // Check 1: Maximum 2 events allowed per participant
    if (eventList.length > 2) {
      return res.status(400).send("Maximum 2 events allowed per participant");
    }

    // Check 2: Maximum 1 event per event group & Check 3: Max 3 dance participants per School
    if (eventList.length > 0) {
      const selectedEvents = await Event.find({ _id: { $in: eventList } });

      if (selectedEvents.length !== eventList.length) {
        return res.status(400).send("One or more selected events are invalid");
      }

      // Check only 1 event per group
      const eventGroups = selectedEvents.map((e) => e.eventGroup);
      const uniqueGroups = new Set(eventGroups);
      if (uniqueGroups.size !== eventGroups.length) {
        return res.status(400).send("Only 1 event per group is allowed");
      }

      // Check maximum 3 participants for dance for each school
      const danceEvents = selectedEvents.filter((e) => e.eventName && /dance/i.test(e.eventName));
      for (const dEvent of danceEvents) {
        if (poc) {
          const danceCount = await Participant.countDocuments({
            poc: poc,
            events: { $in: [dEvent._id, dEvent._id.toString()] },
          });
          if (danceCount >= 3) {
            return res.status(400).send(`Maximum limit (3) for "${dEvent.eventName}" reached for this POC.`);
          }
        }
      }
    }

    // Create a new participant
    const newParticipant = new Participant({
      name,
      class: studentClass,
      phone,
      school,
      address,
      photo: req.file ? req.file.filename : "",
      poc: poc || null,
      events: eventList,
    });

    // Save participant to the database
    const savedParticipant = await newParticipant.save();

    // Update the event documents to add this participant to the respective events
    await Event.updateMany(
      { _id: { $in: eventList } },
      { $push: { participants: savedParticipant._id } }
    );

    return res.status(201).send("Participant Added");
  } catch (error) {
    console.error("Error adding participant:", error);
    return res.status(500).send("Internal Server Error");
  }
};

module.exports = { addParticipants };