import React, { useState, useMemo } from 'react';
import { Filter, CheckCircle2, ArrowUp, ArrowDown, ListFilter, Sparkles } from 'lucide-react';
import { useTasks } from '../hooks/useTasks';
import TaskCard from '../components/tasks/TaskCard';
import TaskInput from '../components/tasks/TaskInput';
import EditTaskModal from '../components/tasks/EditTaskModal';
import { smartSortTasks } from '../utils/smartSort';

const TasksPage = () => {
  const { tasks, loading, addTask, updateTask, updateTaskStatus, deleteTask } = useTasks();
  
  const [filter, setFilter] = useState('ALL');
  
  const [sortBy, setSortBy] = useState('createdAt'); 
  const [sortDir, setSortDir] = useState('desc');

  const [editingTask, setEditingTask] = useState(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  const processedTasks = useMemo(() => {
    let result = tasks.filter(task => {
      if (task.status === 'DONE') return false; 
      if (filter === 'ALL') return true;
      return task.taskType === filter;
    });

    if (sortBy === 'smart') {
        return smartSortTasks(result);
    }

    return result.sort((a, b) => {
      let res = 0;
      switch (sortBy) {
        case 'priority':
          const weights = { high: 3, medium: 2, low: 1 };
          res = (weights[a.priority] || 2) - (weights[b.priority] || 2);
          break;
        case 'estimatedTime':
          res = (a.estimatedTime || 0) - (b.estimatedTime || 0);
          break;
        case 'title':
          res = a.title.localeCompare(b.title);
          break;
        case 'createdAt':
        default:
          res = new Date(a.createdAt) - new Date(b.createdAt);
          break;
      }
      return sortDir === 'asc' ? res : -res;
    });

  }, [tasks, filter, sortBy, sortDir]);

  const handleEditClick = (task) => {
    setEditingTask(task);
    setIsEditModalOpen(true);
  };
  const handleSaveEdit = async (id, updatedData) => {
    await updateTask(id, updatedData);
  };

  const toggleSortDir = () => {
    setSortDir(prev => prev === 'asc' ? 'desc' : 'asc');
  };

  return (
    <div className="max-w-4xl mx-auto pb-20">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-text-main">Wszystkie Zadania</h1>
          <p className="text-text-muted mt-1">Zarządzaj swoją pełną listą zadań</p>
        </div>
      </div>

      <TaskInput onAddTask={addTask} />

      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        
        <div className="flex items-center gap-2 overflow-x-auto pb-2 md:pb-0">
          <Filter size={16} className="text-text-muted mr-2" />
          {['ALL', 'ACTIVE', 'PASSIVE'].map((type) => (
            <button
              key={type}
              onClick={() => setFilter(type)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all border whitespace-nowrap ${
                filter === type
                  ? 'bg-primary border-primary text-text-main shadow-primary'
                  : 'bg-surface border-border text-text-muted hover:bg-surfaceHover hover:text-text-main'
              }`}
            >
              {type === 'ALL' ? 'Wszystkie' : type === 'ACTIVE' ? '⚡ Active' : '☕ Passive'}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-3">
            
            <button
                onClick={() => setSortBy('smart')}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-bold transition-all border ${
                    sortBy === 'smart'
                        ? 'bg-primary border-primary text-text-main shadow-primary ring-1 ring-primary-50'
                        : 'bg-surface border-border text-text-muted hover:border-primary-50 hover:text-primary'
                }`}
            >
                <Sparkles size={14} className={sortBy === 'smart' ? 'text-yellow' : ''} />
                Optymalizuj AI
            </button>

            <div className="w-px h-6 bg-border mx-1"></div>

            <div className={`flex items-center gap-2 p-1 rounded-lg border transition-colors ${
                sortBy !== 'smart' ? 'bg-surface border-border' : 'border-transparent opacity-50 hover:opacity-100'
            }`}>
                <ListFilter size={16} className="text-text-muted ml-2" />
                
                <select 
                    value={sortBy === 'smart' ? '' : sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="bg-transparent text-xs text-text-main font-medium focus:outline-none border-none py-1 pr-1 cursor-pointer hover:text-primary transition-colors [&>option]:bg-surface [&>option]:text-text-main"
                >
                    {sortBy === 'smart' && <option value="" disabled hidden>Wybierz...</option>}
                    
                    <option value="createdAt">Data dodania</option>
                    <option value="priority">Priorytet</option>
                    <option value="estimatedTime">Czas wykonania</option>
                    <option value="title">Alfabetycznie</option>
                </select>

                <button 
                    onClick={toggleSortDir}
                    disabled={sortBy === 'smart'}
                    className={`p-1.5 rounded-md transition-colors border ${
                        sortBy === 'smart' 
                            ? 'text-text-muted border-transparent cursor-not-allowed' 
                            : 'bg-background hover:bg-surfaceHover text-text-muted hover:text-primary border-border'
                    }`}
                    title={sortDir === 'asc' ? "Rosnąco" : "Malejąco"}
                >
                    {sortDir === 'asc' ? <ArrowUp size={14} /> : <ArrowDown size={14} />}
                </button>
            </div>
        </div>

      </div>

      <div className="space-y-3">
        {loading ? (
          <div className="text-center py-10 text-text-muted">Ładowanie...</div>
        ) : processedTasks.length === 0 ? (
          <div className="text-center py-16 border-2 border-dashed border-border rounded-2xl bg-surface-30">
            <CheckCircle2 size={48} className="mx-auto text-text-muted mb-4" />
            <h3 className="text-xl font-medium text-text-muted">Brak zadań</h3>
            <p className="text-text-muted mt-2">
              {filter !== 'ALL' ? 'Zmień filtry lub dodaj nowe zadanie.' : 'Dodaj nowe zadanie powyżej!'}
            </p>
          </div>
        ) : (
          processedTasks.map((task, index) => (
            <div key={task._id} className="animate-in fade-in slide-in-from-bottom-2 duration-300" style={{ animationDelay: `${index * 50}ms` }}>
              <TaskCard 
                task={task}
                onStatusChange={updateTaskStatus}
                onDelete={deleteTask}
                onEdit={handleEditClick}
              />
            </div>
          ))
        )}
      </div>

      <EditTaskModal 
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        task={editingTask}
        onSave={handleSaveEdit}
      />
    </div>
  );
};

export default TasksPage;