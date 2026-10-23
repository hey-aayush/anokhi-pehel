const Student = require("../models/Student");
const Participant = require("../models/AntyodayaParticipant");
const { listValues, parsePagination, nameFilter } = require("../utils/listQuery");

const sendList = async (res, model, filter, pagination, sort, lean = false) => {
  if (!pagination) {
    const query = model.find(filter);
    return res.json(lean ? await query.lean() : await query);
  }

  const { page, limit } = pagination;
  const [items, total] = await Promise.all([
    model.find(filter).sort(sort).skip((page - 1) * limit).limit(limit).lean(),
    model.countDocuments(filter),
  ]);
  return res.json({ items, page, limit, total });
};

const listStudents = async (req, res) => {
  try {
    const pagination = parsePagination(req.query);
    const filter = {};
    const classes = listValues(req.query.classes);
    const locations = listValues(req.query.locations);
    if (classes.length) filter.className = { $in: classes };
    if (locations.length) filter.location = { $in: locations };
    const name = nameFilter(req.query.name);
    if (name) filter.name = name;
    return await sendList(res, Student, filter, pagination, { _id: 1 });
  } catch (error) {
    if (error.message.startsWith("page and limit")) return res.status(400).json({ message: error.message });
    return res.status(500).json({ message: "Server error" });
  }
};

const listParticipants = async (req, res) => {
  try {
    const pagination = parsePagination(req.query);
    const filter = {};
    const classes = listValues(req.query.classes);
    const years = listValues(req.query.years);
    if (classes.length) filter.class = { $in: classes };
    if (years.length) {
      if (years.some((year) => !/^\d{4}$/.test(year))) return res.status(400).json({ message: "Invalid years filter" });
      filter.year = { $in: years.map(Number) };
    } else if (req.query.year && !isNaN(Number(req.query.year))) {
      filter.year = Number(req.query.year);
    }
    const name = nameFilter(req.query.name);
    const school = nameFilter(req.query.school);
    if (name) filter.name = name;
    if (school) filter.school = school;
    return await sendList(res, Participant, filter, pagination, { year: -1, name: 1, _id: 1 }, true);
  } catch (error) {
    if (error.message.startsWith("page and limit")) return res.status(400).json({ message: error.message });
    return res.status(500).json({ message: "Server error" });
  }
};

module.exports = { listStudents, listParticipants };
