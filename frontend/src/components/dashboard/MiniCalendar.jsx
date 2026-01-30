import React from 'react';
import { Link } from 'react-router-dom';
import { Calendar as CalIcon, Plus } from 'lucide-react';
import { format, isSameDay } from 'date-fns';
import { pl } from 'date-fns/locale';
import { useEvents } from '../../hooks/useEvents';

const MiniCalendar = () => {
  const { events } = useEvents();
  const today = new Date();

  const todayEvents = events
    .filter(ev => isSameDay(ev.start, today))
    .sort((a, b) => a.start - b.start);

  return (
    <div className="bg-surface border border-border rounded-2xl p-5 h-full flex flex-col shadow-lg">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2 text-text-main font-semibold">
           <CalIcon className="text-primary" size={20} />
           <h3>Dzisiaj</h3>
        </div>
        <span className="text-xs text-text-muted capitalize">
          {format(today, 'MMMM yyyy', { locale: pl })}
        </span>
      </div>

      <div className="text-center mb-6">
        <span className="block text-sm text-primary uppercase font-bold tracking-wider mb-1">
          {format(today, 'eeee', { locale: pl })}
        </span>
        <span className="block text-5xl font-bold text-text-main">
          {format(today, 'd')}
        </span>
      </div>

      <div className="space-y-2 flex-1 overflow-y-auto custom-scrollbar pr-1">
        {todayEvents.length === 0 ? (
          <p className="text-center text-xs text-text-muted mt-2">Brak spotkań na dziś.</p>
        ) : (
          todayEvents.map(ev => (
            <div key={ev._id} className="flex items-center gap-3 text-sm p-2 rounded-lg bg-background/50 border border-border">
              <span className="text-text-muted font-mono text-xs w-10">
                {format(ev.start, 'HH:mm')}
              </span>
              <div className="w-1 h-8 rounded-full bg-primary" />
              <span className="text-text-main truncate flex-1" title={ev.title}>{ev.title}</span>
            </div>
          ))
        )}
      </div>
      
      <div className="text-center mt-4 border-t border-border pt-3">
         <Link to="/dashboard/calendar" className="text-xs text-text-muted hover:text-primary transition-colors flex items-center justify-center gap-1">
           <Plus size={12} /> Zarządzaj w kalendarzu
         </Link>
      </div>
    </div>
  );
};

export default MiniCalendar;