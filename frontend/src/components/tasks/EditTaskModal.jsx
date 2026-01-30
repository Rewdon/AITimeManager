import React, { useState, useEffect } from 'react';
import { X, Save, Clock, Type, AlignLeft, Flag } from 'lucide-react';

const EditTaskModal = ({ task, isOpen, onClose, onSave }) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    taskType: 'ACTIVE',
    estimatedTime: 30,
    priority: 'medium',
    status: 'TODO'
  });

  useEffect(() => {
    if (task) {
      setFormData({
        title: task.title || '',
        description: task.description || '',
        taskType: task.taskType || 'ACTIVE',
        estimatedTime: task.estimatedTime || 30,
        priority: task.priority || 'medium',
        status: task.status || 'TODO'
      });
    }
  }, [task, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(task._id, formData);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-overlay backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg bg-surface border border-border rounded-2xl shadow-2xl p-6 animate-in zoom-in-95 duration-200">
        
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold text-text-main">Edytuj Zadanie</h2>
          <button onClick={onClose} className="p-2 text-text-muted hover:text-text-main hover:bg-surfaceHover rounded-full transition-colors">
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          
          <div>
            <label className="block text-xs font-medium text-text-muted mb-1.5 uppercase">Tytuł</label>
            <input
              type="text"
              required
              value={formData.title}
              onChange={(e) => setFormData({...formData, title: e.target.value})}
              className="w-full bg-background border border-border rounded-xl px-4 py-2.5 text-text-main focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all"
            />
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
            <div>
              <label className="text-xs font-medium text-text-muted mb-1.5 flex items-center gap-1"><Type size={12}/> Typ</label>
              <select
                value={formData.taskType}
                onChange={(e) => setFormData({...formData, taskType: e.target.value})}
                className="w-full bg-background border border-border rounded-lg px-2 py-2 text-sm text-text-main focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all"
              >
                <option value="ACTIVE">ACTIVE</option>
                <option value="PASSIVE">PASSIVE</option>
              </select>
            </div>

            <div>
              <label className="text-xs font-medium text-text-muted mb-1.5 flex items-center gap-1"><Clock size={12}/> Czas (min)</label>
              <input
                type="number"
                min="1"
                value={formData.estimatedTime}
                onChange={(e) => setFormData({...formData, estimatedTime: Number(e.target.value)})}
                className="w-full bg-background border border-border rounded-lg px-2 py-2 text-sm text-text-main focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all"
              />
            </div>

            <div>
              <label className="text-xs font-medium text-text-muted mb-1.5 flex items-center gap-1"><Flag size={12}/> Priorytet</label>
              <select
                value={formData.priority}
                onChange={(e) => setFormData({...formData, priority: e.target.value})}
                className="w-full bg-background border border-border rounded-lg px-2 py-2 text-sm text-text-main focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all"
              >
                <option value="low">Niski</option>
                <option value="medium">Średni</option>
                <option value="high">Wysoki</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-text-muted mb-1.5 flex items-center gap-1"><AlignLeft size={12}/> Opis</label>
            <textarea
              rows="3"
              value={formData.description}
              onChange={(e) => setFormData({...formData, description: e.target.value})}
              className="w-full bg-background border border-border rounded-xl px-4 py-2 text-text-main focus:border-primary focus:ring-1 focus:ring-primary outline-none resize-none transition-all"
            />
          </div>

          <div className="flex gap-3 pt-4 mt-2 border-t border-border">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 bg-transparent border border-border text-text-muted rounded-lg hover:bg-surfaceHover hover:text-text-main transition-colors"
            >
              Anuluj
            </button>
            <button
              type="submit"
              className="flex-1 px-4 py-2 bg-primary hover:bg-primary-hover text-text-main rounded-lg transition-colors shadow-primary hover:shadow-primary-hover flex justify-center items-center gap-2"
            >
              <Save size={18} /> Zapisz zmiany
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditTaskModal;