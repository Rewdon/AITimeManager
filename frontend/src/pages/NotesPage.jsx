import React, { useState } from 'react';
import { Search, Trash2, StickyNote } from 'lucide-react';
import { useNotes } from '../hooks/useNotes';

const colorMap = {
  yellow: {
    bg: 'bg-note-yellow-bg',
    border: 'border-note-yellow-border',
    text: 'text-note-yellow-text',
  },
  blue: {
    bg: 'bg-note-blue-bg',
    border: 'border-note-blue-border',
    text: 'text-note-blue-text',
  },
  green: {
    bg: 'bg-note-green-bg',
    border: 'border-note-green-border',
    text: 'text-note-green-text',
  },
  purple: {
    bg: 'bg-note-purple-bg',
    border: 'border-note-purple-border',
    text: 'text-note-purple-text',
  },
  red: {
    bg: 'bg-note-red-bg',
    border: 'border-note-red-border',
    text: 'text-note-red-text',
  },
};

const colors = Object.keys(colorMap);

const NotesPage = () => {
  const { notes, addNote, deleteNote } = useNotes();
  const [newNoteContent, setNewNoteContent] = useState('');
  const [selectedColor, setSelectedColor] = useState('yellow');
  const [searchQuery, setSearchQuery] = useState('');

  const handleAddNote = (e) => {
    e.preventDefault();
    if (!newNoteContent.trim()) return;
    addNote(newNoteContent, selectedColor);
    setNewNoteContent('');
  };

  const filteredNotes = notes.filter(note => 
    note.content.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="max-w-6xl mx-auto">
      
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-text-main flex items-center gap-2">
            <StickyNote className="text-yellow" /> Notatki
          </h1>
          <p className="text-text-muted mt-1">Miejsce na Twoje luźne myśli i pomysły</p>
        </div>

        <div className="relative w-full md:w-64">
          <Search className="absolute left-3 top-2.5 text-text-muted" size={18} />
          <input 
            type="text" 
            placeholder="Szukaj notatek..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-surface border border-border rounded-xl pl-10 pr-4 py-2 text-text-main placeholder:text-text-muted focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all"
          />
        </div>
      </div>

      <div className="bg-surface border border-border rounded-2xl p-4 mb-8 shadow-lg max-w-2xl mx-auto relative group focus-within:ring-1 focus-within:ring-primary transition-all">
        <form onSubmit={handleAddNote}>
          <textarea
            value={newNoteContent}
            onChange={(e) => setNewNoteContent(e.target.value)}
            placeholder="Napisz notatkę..."
            rows={3}
            className="w-full bg-transparent border-none text-lg text-text-main placeholder-text-muted resize-none focus:ring-0 outline-none"
          />
          
          <div className="flex items-center justify-between mt-2 pt-2 border-t border-border">
            <div className="flex gap-2">
              {colors.map((color) => (
                <button
                  key={color}
                  type="button"
                  onClick={() => setSelectedColor(color)}
                  className={`w-6 h-6 rounded-full border transition-transform hover:scale-110 ${colorMap[color].bg} ${colorMap[color].border} ${selectedColor === color ? 'ring-2 ring-text-main scale-110' : ''}`}
                  title={color}
                />
              ))}
            </div>

            <button 
              type="submit"
              disabled={!newNoteContent.trim()}
              className="bg-primary hover:bg-primary-hover text-text-main px-4 py-1.5 rounded-lg text-sm font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-primary hover:shadow-primary-hover"
            >
              Dodaj
            </button>
          </div>
        </form>
      </div>

      {filteredNotes.length === 0 ? (
        <div className="text-center py-16 text-text-muted">
          {searchQuery ? 'Nie znaleziono notatek pasujących do wyszukiwania.' : 'Brak notatek. Dodaj pierwszą powyżej!'}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 items-start">
          {filteredNotes.map((note) => {
            const style = colorMap[note.color] || colorMap.yellow;
            
            return (
              <div 
                key={note._id} 
                className={`group relative p-5 rounded-2xl border transition-all duration-300 hover:-translate-y-1 hover:shadow-xl ${style.bg} ${style.border}`}
              >
                <p className={`whitespace-pre-wrap ${style.text}`}>{note.content}</p>
                
                <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity flex gap-1">
                   <button 
                    onClick={() => deleteNote(note._id)}
                    className="p-1.5 bg-overlay hover:bg-danger-hover text-text-main rounded-lg backdrop-blur-sm transition-colors"
                    title="Usuń"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
                
                <div className="mt-4 text-[10px] opacity-50 font-mono text-text-muted">
                  {new Date(note.createdAt).toLocaleDateString()}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default NotesPage;