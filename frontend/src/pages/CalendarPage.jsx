import React, { useState } from 'react';
import {
  format, startOfMonth, endOfMonth, startOfWeek, endOfWeek,
  eachDayOfInterval, isSameMonth, isSameDay, addMonths, subMonths, isToday,
  isBefore, startOfToday
} from 'date-fns';
import { pl } from 'date-fns/locale';
import { ChevronLeft, ChevronRight, Plus, Clock, X } from 'lucide-react';
import { useEvents } from '../hooks/useEvents';

const CalendarPage = () => {
  const { events, addEvent, deleteEvent } = useEvents();
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(startOfToday());
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newEvent, setNewEvent] = useState({ title: '', time: '10:00', duration: 60 });

  const today = startOfToday();
  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(monthStart);
  const startDate = startOfWeek(monthStart, { weekStartsOn: 1 });
  const endDate = endOfWeek(monthEnd, { weekStartsOn: 1 });

  const calendarDays = eachDayOfInterval({ start: startDate, end: endDate });

  const isSelectedPast = isBefore(selectedDate, today);

  const handlePrevMonth = () => setCurrentDate(subMonths(currentDate, 1));
  const handleNextMonth = () => setCurrentDate(addMonths(currentDate, 1));

  const handleAddEvent = async (e) => {
    e.preventDefault();
    if (isSelectedPast) return;

    const [hours, minutes] = newEvent.time.split(':');
    const start = new Date(selectedDate);
    start.setHours(parseInt(hours), parseInt(minutes));
    const end = new Date(start.getTime() + newEvent.duration * 60000);

    await addEvent({ title: newEvent.title, start, end });
    setIsModalOpen(false);
    setNewEvent({ title: '', time: '10:00', duration: 60 });
  };

  const selectedDayEvents = events.filter(ev => isSameDay(ev.start, selectedDate));

  return (
    <div className="max-w-7xl mx-auto flex flex-col lg:flex-row gap-8 h-[calc(100vh-100px)]">

      <div className="flex-1 bg-surface border border-border rounded-2xl p-6 shadow-lg flex flex-col">
        
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-text-main capitalize">
            {format(currentDate, 'MMMM yyyy', { locale: pl })}
          </h2>
          <div className="flex gap-2">
            <button onClick={handlePrevMonth} className="p-2 hover:bg-surfaceHover rounded-lg text-text-muted transition-colors"><ChevronLeft /></button>
            <button onClick={() => setCurrentDate(new Date())} className="px-3 py-1 text-sm bg-primary-20 text-primary rounded-lg hover:bg-primary-10 transition-colors">Dziś</button>
            <button onClick={handleNextMonth} className="p-2 hover:bg-surfaceHover rounded-lg text-text-muted transition-colors"><ChevronRight /></button>
          </div>
        </div>

        <div className="grid grid-cols-7 mb-2 text-center">
          {['Pn', 'Wt', 'Śr', 'Cz', 'Pt', 'So', 'Nd'].map(day => (
            <div key={day} className="text-xs font-bold text-text-muted uppercase py-2">{day}</div>
          ))}
        </div>

        <div className="grid grid-cols-7 gap-1 flex-1">
          {calendarDays.map(day => {
            const dayEvents = events.filter(ev => isSameDay(ev.start, day));
            const isSelected = isSameDay(day, selectedDate);
            const isCurrentMonth = isSameMonth(day, monthStart);
            const isPast = isBefore(day, today);

            return (
              <div
                key={day.toString()}
                onClick={() => setSelectedDate(day)}
                className={`
                  relative p-2 rounded-xl transition-all border cursor-pointer flex flex-col items-center justify-start
                  ${!isCurrentMonth
                    ? 'text-text-muted bg-transparent border-transparent opacity-50'
                    : isPast
                      ? 'text-text-muted bg-surface-30 border-border'
                      : 'bg-background border-border'
                  }
                  ${isSelected ? 'ring-1 ring-primary border-primary bg-primary-10 z-10' : ''}
                  ${!isSelected && isCurrentMonth && !isPast ? 'hover:bg-surfaceHover hover:border-primary-50' : ''}
                `}
              >
                <div className={`text-sm font-medium mb-1 ${isToday(day) ? 'text-primary font-bold' : ''} ${isCurrentMonth && !isPast ? 'text-text-main' : ''}`}>
                  {format(day, 'd')}
                </div>
                
                <div className="flex flex-wrap gap-1 justify-center">
                  {dayEvents.slice(0, 3).map((ev, i) => (
                    <div key={i} className={`w-1.5 h-1.5 rounded-full ${isPast ? 'bg-text-muted' : 'bg-primary'}`} title={ev.title} />
                  ))}
                  {dayEvents.length > 3 && <span className="text-[8px] text-text-muted leading-none">+</span>}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="w-full lg:w-96 bg-surface border border-border rounded-2xl p-6 flex flex-col shadow-lg">
        <div className="flex justify-between items-center mb-6">
          <div>
            <span className="text-sm text-text-muted uppercase font-bold">{format(selectedDate, 'eeee', { locale: pl })}</span>
            <h3 className="text-3xl font-bold text-text-main">{format(selectedDate, 'd MMMM', { locale: pl })}</h3>
          </div>
          
          {!isSelectedPast && (
            <button
              onClick={() => setIsModalOpen(true)}
              className="p-3 bg-primary hover:bg-primary-hover text-text-main rounded-xl shadow-primary hover:shadow-primary-hover transition-all"
            >
              <Plus size={24} />
            </button>
          )}
        </div>

        <div className="flex-1 overflow-y-auto space-y-4 pr-1 custom-scrollbar">
          {selectedDayEvents.length === 0 ? (
            <div className="text-center text-text-muted py-10 flex flex-col items-center gap-2">
              <Clock size={32} className="opacity-20" />
              <span>{isSelectedPast ? 'Brak historii z tego dnia.' : 'Brak planów na ten dzień.'}</span>
            </div>
          ) : (
            selectedDayEvents.map(ev => (
              <div key={ev._id} className={`group border border-border rounded-xl p-4 transition-colors relative ${isSelectedPast ? 'bg-surface-30 opacity-70' : 'bg-background hover:border-primary-50'}`}>
                <div className="flex justify-between items-start mb-1">
                  <h4 className="font-semibold text-text-main">{ev.title}</h4>
                  <button 
                    onClick={() => deleteEvent(ev._id)} 
                    className="text-text-muted hover:text-danger-hover hover:bg-danger-background rounded p-0.5 opacity-0 group-hover:opacity-100 transition-all"
                  >
                    <X size={16} />
                  </button>
                </div>
                <div className="flex items-center gap-2 text-xs text-text-muted">
                  <Clock size={12} />
                  {format(ev.start, 'HH:mm')} - {format(ev.end, 'HH:mm')}
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-overlay backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-surface border border-border rounded-2xl p-6 w-full max-w-sm animate-in zoom-in-95 shadow-2xl">
            <h3 className="text-xl font-bold text-text-main mb-4">Nowe Wydarzenie</h3>
            <form onSubmit={handleAddEvent} className="space-y-4">
              <div>
                <label className="text-xs text-text-muted uppercase font-bold mb-1 block">Nazwa</label>
                <input 
                    autoFocus 
                    required 
                    className="w-full bg-background border border-border rounded-lg p-2.5 text-text-main focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all" 
                    value={newEvent.title} 
                    onChange={e => setNewEvent({...newEvent, title: e.target.value})} 
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs text-text-muted uppercase font-bold mb-1 block">Godzina</label>
                  <input 
                    type="time" 
                    required 
                    className="w-full bg-background border border-border rounded-lg p-2.5 text-text-main focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all" 
                    value={newEvent.time} 
                    onChange={e => setNewEvent({...newEvent, time: e.target.value})} 
                  />
                </div>
                <div>
                  <label className="text-xs text-text-muted uppercase font-bold mb-1 block">Czas (min)</label>
                  <input 
                    type="number" 
                    min="15" 
                    step="15" 
                    className="w-full bg-background border border-border rounded-lg p-2.5 text-text-main focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all" 
                    value={newEvent.duration} 
                    onChange={e => setNewEvent({...newEvent, duration: e.target.value})} 
                  />
                </div>
              </div>
              <div className="flex gap-2 mt-6 pt-2">
                <button type="button" onClick={() => setIsModalOpen(false)} className="flex-1 py-2.5 text-text-muted hover:text-text-main hover:bg-surfaceHover border border-transparent hover:border-border rounded-lg transition-all">Anuluj</button>
                <button type="submit" className="flex-1 py-2.5 bg-primary text-text-main rounded-lg hover:bg-primary-hover shadow-primary hover:shadow-primary-hover transition-all font-medium">Dodaj</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default CalendarPage;