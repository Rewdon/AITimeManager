import { useState, useEffect, useCallback } from 'react';
import api from '../api/axios';

export const useTasks = () => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchTasks = useCallback(async () => {
    try {
      setLoading(true);
      const response = await api.get('/tasks');
      setTasks(response.data);
      setError(null);
    } catch (err) {
      setError('Nie udało się pobrać listy zadań.');
    } finally {
      setLoading(false);
    }
  }, []);

  const addTask = async (taskData) => {
    try {
      const response = await api.post('/tasks', taskData);
      setTasks((prev) => [response.data, ...prev]);
      return response.data;
    } catch (err) {
      setError('Nie udało się dodać zadania.');
      throw err;
    }
  };

  const updateTask = async (id, updatedData) => {
    setTasks(prev => prev.map(task => 
      task._id === id ? { ...task, ...updatedData } : task
    ));

    try {
      const response = await api.put(`/tasks/${id}`, updatedData);
      
      setTasks(prev => prev.map(task => 
        task._id === id ? response.data : task
      ));
    } catch (err) {
      setError('Nie udało się zaktualizować zadania.');
      fetchTasks(); 
    }
  };

  const updateTaskStatus = (id, status) => updateTask(id, { status });

  const deleteTask = async (id) => {
    try {
      await api.delete(`/tasks/${id}`);
      setTasks((prev) => prev.filter((task) => task._id !== id));
    } catch (err) {
      setError('Nie udało się usunąć zadania.');
    }
  };

  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  return { 
    tasks, 
    loading, 
    error, 
    addTask, 
    updateTask,       
    updateTaskStatus, 
    deleteTask, 
    refreshTasks: fetchTasks 
  };
};