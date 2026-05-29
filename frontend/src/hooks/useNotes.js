import { useState, useEffect, useCallback } from 'react';
import api from '../api/axios';
import { useToast } from '../context/ToastContext';

export const useNotes = () => {
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { success, error: showError } = useToast();

  const fetchNotes = useCallback(async () => {
    try {
      setLoading(true);
      const res = await api.get('/notes');
      setNotes(res.data);
      setError(null);
    } catch (err) {
      setError('Nie udało się pobrać notatek.');
      showError('Nie udało się pobrać notatek.');
    } finally {
      setLoading(false);
    }
  }, [showError]);

  const addNote = async (content, color = 'yellow') => {
    try {
      const res = await api.post('/notes', { content, color });
      setNotes(prev => [res.data, ...prev]);
      success('Notatka została dodana!');
      return res.data;
    } catch (err) {
      setError('Nie udało się dodać notatki.');
      showError('Nie udało się dodać notatki.');
      throw err;
    }
  };

  const deleteNote = async (id) => {
    try {
      await api.delete(`/notes/${id}`);
      setNotes(prev => prev.filter(n => n._id !== id));
      success('Notatka usunięta.');
    } catch (err) {
      setError('Nie udało się usunąć notatki.');
      showError('Nie udało się usunąć notatki.');
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