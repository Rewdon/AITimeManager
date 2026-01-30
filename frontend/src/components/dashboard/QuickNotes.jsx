import React, { useState } from 'react';
import { Plus, X, StickyNote } from 'lucide-react';
import { useNotes } from '../../hooks/useNotes';

const colorStyles = {
  yellow: 'bg-note-yellow-bg border-note-yellow-border text-note-yellow-text',
  blue: 'bg-note-blue-bg border-note-blue-border text-note-blue-text',
  green: 'bg-note-green-bg border-note-green-border text-note-green-text',
  purple: 'bg-note-purple-bg border-note-purple-border text-note-purple-text',
  red: 'bg-note-red-bg border-note-red-border text-note-red-text',
};

const QuickNotes = () => {
  const { notes, addNote, deleteNote } = useNotes();
  const [newNote, setNewNote] = useState('');

  const handleAdd = (e) => {
    e.preventDefault();
    if (!newNote.trim()) return;
    addNote(newNote, 'yellow');
    setNewNote('');
  };

  return (
    <div className="bg-surface border border-border rounded-2xl p-5 flex flex-col h-full shadow-lg">
      <div className="flex items-center gap-2 mb-4 text-text-main font-semibold">
        <StickyNote className="text-yellow" size={20} />
        <h3>Szybkie Notatki</h3>
      </div>

      <form onSubmit={handleAdd} className="mb-4 relative">
        <input
          type="text"
          value={newNote}
          onChange={(e) => setNewNote(e.target.value)}
          placeholder="Wpisz i wciśnij Enter..."
          className="w-full bg-background border border-border rounded-lg pl-3 pr-10 py-2 text-sm text-text-main placeholder:text-text-muted focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all"
        />
        <button 
          type="submit" 
          className="absolute right-2 top-1.5 text-text-muted hover:text-primary transition-colors"
        >
          <Plus size={16} />
        </button>
      </form>

      <div className="flex-1 overflow-y-auto space-y-2 pr-1 custom-scrollbar">
        {notes.length === 0 ? (
          <p className="text-xs text-text-muted text-center mt-4">Pusto...</p>
        ) : (
          notes.map(note => {
            const styleClass = colorStyles[note.color] || colorStyles.yellow;
            
            return (
              <div key={note._id} className={`group relative border rounded-lg p-3 text-sm transition-all ${styleClass}`}>
                <p className="pr-4 break-words">{note.content}</p>
                <button
                  onClick={() => deleteNote(note._id)}
                  className="absolute top-1 right-1 opacity-0 group-hover:opacity-100 text-current hover:text-text-main transition-opacity"
                >
                  <X size={14} />
                </button>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

export default QuickNotes;