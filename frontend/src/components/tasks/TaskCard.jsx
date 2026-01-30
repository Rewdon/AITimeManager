import React from 'react';
import { Clock, CheckCircle, PlayCircle, Trash2, Pencil } from 'lucide-react';

const TaskCard = ({ task, onStatusChange, onDelete, onEdit }) => { 
  const isDone = task.status === 'DONE';
  
  const getPriorityColor = () => {
    switch (task.priority) {
      case 'high': return 'bg-danger';
      case 'low': return 'bg-blue';
      case 'medium': default: return 'bg-yellow';
    }
  };

  const getStatusBadge = () => {
    switch (task.status) {
      case 'DONE': return 'text-note-green-text bg-note-green-bg border-note-green-border';
      case 'IN_PROGRESS': return 'text-note-blue-text bg-note-blue-bg border-note-blue-border';
      default: return 'text-text-muted bg-surface-50 border-border';
    }
  };

  return (
    <div className={`relative group rounded-lg border transition-all duration-200 overflow-hidden pl-1 ${
      isDone ? 'bg-surface-30 border-border opacity-60' : 'bg-surface border-border hover:border-primary-50 hover:shadow-md'
    }`}>
      
      <div className={`absolute left-0 top-0 bottom-0 w-1 ${getPriorityColor()}`} />

      <div className="p-3 pl-4 flex items-center justify-between gap-4">
        
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <span className={`text-[10px] uppercase font-bold px-1.5 py-0.5 rounded border ${getStatusBadge()}`}>
              {task.status === 'TODO' ? 'Do zrobienia' : task.status === 'IN_PROGRESS' ? 'W trakcie' : 'Gotowe'}
            </span>
            <span className="text-[10px] text-text-muted font-mono px-1 uppercase">
              {task.taskType}
            </span>
          </div>
          <h3 className={`font-medium text-base truncate ${isDone ? 'text-text-muted line-through' : 'text-text-main'}`}>
            {task.title}
          </h3>
          {task.description && <p className="text-text-muted text-xs mt-0.5 line-clamp-1">{task.description}</p>}
        </div>

        <div className="flex items-center gap-4 shrink-0">
          <div className="flex items-center text-text-muted text-xs bg-background px-2 py-1 rounded">
            <Clock size={12} className="mr-1.5" />
            {task.estimatedTime || '-'} min
          </div>

          <div className="flex items-center gap-1 opacity-100 lg:opacity-0 lg:group-hover:opacity-100 transition-opacity">
            <button 
              onClick={() => onEdit(task)}
              className="p-1.5 hover:bg-surfaceHover text-text-muted hover:text-text-main rounded transition-colors"
              title="Edytuj"
            >
              <Pencil size={16} />
            </button>

            {task.status !== 'DONE' && (
               <button 
                 onClick={() => onStatusChange(task._id, 'DONE')} 
                 className="p-1.5 hover:bg-note-green-bg text-text-muted hover:text-note-green-text rounded transition-colors"
                 title="Oznacz jako zrobione"
               >
                 <CheckCircle size={16} />
               </button>
            )}
            
            {task.status === 'TODO' && (
               <button 
                 onClick={() => onStatusChange(task._id, 'IN_PROGRESS')} 
                 className="p-1.5 hover:bg-note-blue-bg text-text-muted hover:text-note-blue-text rounded transition-colors"
                 title="Rozpocznij"
               >
                 <PlayCircle size={16} />
               </button>
            )}

            <button 
              onClick={() => onDelete(task._id)} 
              className="p-1.5 hover:bg-danger-background text-text-muted hover:text-danger-hover rounded transition-colors"
              title="Usuń"
            >
              <Trash2 size={16} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TaskCard;