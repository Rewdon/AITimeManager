import { useState, useEffect, useCallback } from 'react';
import api from '../api/axios';

export const useEvents = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchEvents = useCallback(async () => {
    try {
      setLoading(true);
      const res = await api.get('/events');
      const parsedEvents = res.data
        .map(ev => ({
          ...ev,
          start: new Date(ev.start),
          end: new Date(ev.end)
        }))
        .sort((a, b) => a.start - b.start);
        
      setEvents(parsedEvents);
      setError(null);
    } catch (err) {
      setError('Nie udało się pobrać wydarzeń.');
    } finally {
      setLoading(false);
    }
  }, []);

  const addEvent = async (eventData) => {
    try {
      const res = await api.post('/events', eventData);
      const newEvent = {
        ...res.data,
        start: new Date(res.data.start),
        end: new Date(res.data.end)
      };
      setEvents(prev => [...prev, newEvent].sort((a, b) => a.start - b.start));
      return newEvent;
    } catch (err) {
      setError('Nie udało się dodać wydarzenia.');
      throw err;
    }
  };

  const deleteEvent = async (id) => {
    try {
      await api.delete(`/events/${id}`);
      setEvents(prev => prev.filter(e => e._id !== id));
    } catch (err) {
      setError('Nie udało się usunąć wydarzenia.');
    }
  };

  useEffect(() => {
    fetchEvents();
  }, [fetchEvents]);

  return { 
    events, 
    loading, 
    error, 
    addEvent, 
    deleteEvent, 
    refreshEvents: fetchEvents 
  };
};