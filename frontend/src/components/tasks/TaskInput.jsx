import React, { useState } from 'react';
import { Plus, SlidersHorizontal, Clock, Type, AlignLeft, Sparkles, Loader2, Flag } from 'lucide-react';

const TaskInput = ({ onAddTask }) => {
  const [title, setTitle] = useState('');
  const [isExpanded, setIsExpanded] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [advancedData, setAdvancedData] = useState({
    description: '',
    taskType: 'AUTO',
    estimatedTime: '',
    priority: 'medium'
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title.trim()) return;

    setIsSubmitting(true);
    try {
      const payload = {
        title,
        description: isExpanded ? advancedData.description : null,
        taskType: (isExpanded && advancedData.taskType !== 'AUTO') ? advancedData.taskType : null,
        estimatedTime: (isExpanded && advancedData.estimatedTime) ? Number(advancedData.estimatedTime) : null,
        priority: isExpanded ? advancedData.priority : 'medium'
      };

      await onAddTask(payload);

      setTitle('');
      setAdvancedData({ description: '', taskType: 'AUTO', estimatedTime: '', priority: 'medium' });
      setIsExpanded(false);
    } catch (error) {
      // Error handling logic
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="w-full max-w-3xl mx-auto mb-8">
      <form onSubmit={handleSubmit} className="relative">
        
        <div className={`relative bg-surface border transition-all duration-200 rounded-xl overflow-hidden shadow-lg ${
          isExpanded ? 'border-primary ring-1 ring-primary/50' : 'border-border hover:border-primary-50'
        }`}>
          
          <div className="flex items-center px-4 py-3">
            <div className="text-primary mr-3">
              {isSubmitting ? <Loader2 className="animate-spin" size={24} /> : <Plus size={24} />}
            </div>
            
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Co masz do zrobienia? (np. Pranie, Raport dla szefa)"
              className="w-full bg-transparent text-text-main text-lg placeholder-text-muted focus:outline-none"
              disabled={isSubmitting}
              autoFocus
            />

            <button
              type="button"
              onClick={() => setIsExpanded(!isExpanded)}
              className={`p-2 rounded-lg transition-colors ml-2 ${
                isExpanded ? 'bg-primary-20 text-primary' : 'text-text-muted hover:bg-surfaceHover hover:text-text-main'
              }`}
              title="Opcje zaawansowane"
            >
              <SlidersHorizontal size={20} />
            </button>
          </div>

          {isExpanded && (
            <div className="px-4 pb-4 pt-2 border-t border-border animate-in slide-in-from-top-2 fade-in duration-200">
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                
                <div>
                  <label className="text-xs font-medium text-text-muted mb-1.5 flex items-center gap-1">
                    <Type size={12} /> Typ zadania
                  </label>
                  <select
                    value={advancedData.taskType}
                    onChange={(e) => setAdvancedData({ ...advancedData, taskType: e.target.value })}
                    className="w-full bg-background border border-border rounded-lg px-3 py-2 text-sm text-text-main focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary transition-all"
                  >
                    <option value="AUTO">✨ Auto (AI)</option>
                    <option value="ACTIVE">⚡ Active</option>
                    <option value="PASSIVE">☕ Passive</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-medium text-text-muted mb-1.5 flex items-center gap-1">
                    <Clock size={12} /> Czas (min)
                  </label>
                  <input
                    type="number"
                    placeholder="Auto (AI)"
                    value={advancedData.estimatedTime}
                    onChange={(e) => setAdvancedData({ ...advancedData, estimatedTime: e.target.value })}
                    className="w-full bg-background border border-border rounded-lg px-3 py-2 text-sm text-text-main focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary transition-all"
                  />
                </div>

                <div>
                  <label className="text-xs font-medium text-text-muted mb-1.5 flex items-center gap-1">
                    <Flag size={12} /> Priorytet
                  </label>
                  <select
                    value={advancedData.priority}
                    onChange={(e) => setAdvancedData({ ...advancedData, priority: e.target.value })}
                    className="w-full bg-background border border-border rounded-lg px-3 py-2 text-sm text-text-main focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary transition-all"
                  >
                    <option value="low">Niski (Niebieski)</option>
                    <option value="medium">Średni (Żółty)</option>
                    <option value="high">Wysoki (Czerwony)</option>
                  </select>
                </div>
              </div>

              <div className="mb-4">
                  <label className="text-xs font-medium text-text-muted mb-1.5 flex items-center gap-1">
                    <AlignLeft size={12} /> Opis
                  </label>
                <textarea
                  rows="2"
                  value={advancedData.description}
                  onChange={(e) => setAdvancedData({ ...advancedData, description: e.target.value })}
                  placeholder="Dodatkowe szczegóły..."
                  className="w-full bg-background border border-border rounded-lg px-3 py-2 text-sm text-text-main focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary transition-all resize-none"
                />
              </div>

              <div className="flex justify-between items-center">
                 <div className="text-xs text-text-muted flex items-center gap-1">
                    <Sparkles size={12} className="text-primary"/> 
                    Wypełnij tylko to co musisz.
                 </div>
                 <button
                   type="submit"
                   disabled={isSubmitting || !title.trim()}
                   className="bg-primary hover:bg-primary-hover text-text-main px-6 py-2 rounded-lg text-sm font-medium transition-colors disabled:opacity-50 shadow-primary hover:shadow-primary-hover"
                 >
                   {isSubmitting ? 'Dodawanie...' : 'Dodaj Zadanie'}
                 </button>
              </div>
            </div>
          )}
        </div>
      </form>
    </div>
  );
};

export default TaskInput;