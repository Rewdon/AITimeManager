const Event = require('../models/Event');

const getEvents = async (req, res) => {
  try {
    const events = await Event.find({ user: req.user._id }).sort({ start: 1 });
    res.json(events);
  } catch (error) {
    res.status(500).json({ message: 'Błąd pobierania wydarzeń' });
  }
};

const createEvent = async (req, res) => {
  const { title, start, end, description, color } = req.body;
  if (!title || !start || !end) {
    return res.status(400).json({ message: 'Wymagane pola: title, start, end' });
  }

  try {
    const event = await Event.create({
      user: req.user._id,
      title,
      start,
      end,
      description,
      color: color || 'blue'
    });
    res.status(201).json(event);
  } catch (error) {
    res.status(500).json({ message: 'Błąd tworzenia wydarzenia' });
  }
};

const deleteEvent = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);
    if (!event) return res.status(404).json({ message: 'Nie znaleziono' });
    if (event.user.toString() !== req.user._id.toString()) return res.status(401).json({ message: 'Brak dostępu' });

    await event.deleteOne();
    res.json({ message: 'Usunięto' });
  } catch (error) {
    res.status(500).json({ message: 'Błąd usuwania' });
  }
};

module.exports = { getEvents, createEvent, deleteEvent };