import { useState, useEffect, useCallback } from 'react';
import api from '../api/axios';

export const useNotes = () => {
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchNotes = useCallback(async () => {
    try {
      setLoading(true);
      const res = await api.get('/notes');
      setNotes(res.data);
      setError(null);
    } catch (err) {
      setError('Nie udało się pobrać notatek.');
    } finally {
      setLoading(false);
    }
  }, []);

  const addNote = async (content, color = 'yellow') => {
    try {
      const res = await api.post('/notes', { content, color });
      setNotes(prev => [res.data, ...prev]);
      return res.data;
    } catch (err) {
      setError('Nie udało się dodać notatki.');
      throw err;
    }
  };

  const deleteNote = async (id) => {
    try {
      await api.delete(`/notes/${id}`);
      setNotes(prev => prev.filter(n => n._id !== id));
    } catch (err) {
      setError('Nie udało się usunąć notatki.');
    }
  };

  useEffect(() => {
    fetchNotes();
  }, [fetchNotes]);

  return { 
    notes, 
    loading, 
    error, 
    addNote, 
    deleteNote, 
    refreshNotes: fetchNotes 
  };
};