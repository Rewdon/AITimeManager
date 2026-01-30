const Note = require('../models/Note');

// GET /api/notes
const getNotes = async (req, res) => {
  try {
    const notes = await Note.find({ user: req.user._id }).sort({ createdAt: -1 });
    res.json(notes);
  } catch (error) {
    res.status(500).json({ message: 'Błąd pobierania notatek' });
  }
};

// POST /api/notes
const createNote = async (req, res) => {
  const { content, color } = req.body;
  if (!content) return res.status(400).json({ message: 'Treść wymagana' });

  try {
    const note = await Note.create({
      user: req.user._id,
      content,
      color: color || 'yellow'
    });
    res.status(201).json(note);
  } catch (error) {
    res.status(500).json({ message: 'Błąd tworzenia notatki' });
  }
};

// DELETE /api/notes/:id
const deleteNote = async (req, res) => {
  try {
    const note = await Note.findById(req.params.id);
    if (!note) return res.status(404).json({ message: 'Nie znaleziono' });
    if (note.user.toString() !== req.user._id.toString()) return res.status(401).json({ message: 'Brak dostępu' });

    await note.deleteOne();
    res.json({ message: 'Usunięto' });
  } catch (error) {
    res.status(500).json({ message: 'Błąd usuwania' });
  }
};

module.exports = { getNotes, createNote, deleteNote };