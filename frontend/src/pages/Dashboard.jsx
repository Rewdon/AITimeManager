import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Sparkles, ArrowRight, Loader2, RefreshCw, Bot } from 'lucide-react';
import { useTasks } from '../hooks/useTasks';
import api from '../api/axios';
import TaskCard from '../components/tasks/TaskCard';
import TaskInput from '../components/tasks/TaskInput';
import QuickNotes from '../components/dashboard/QuickNotes';
import MiniCalendar from '../components/dashboard/MiniCalendar';
import EditTaskModal from '../components/tasks/EditTaskModal';

const Dashboard = () => {
  const { tasks, updateTaskStatus, deleteTask, updateTask, addTask } = useTasks();
  
  const [dailyPlan, setDailyPlan] = useState('');
  const [loadingPlan, setLoadingPlan] = useState(false); 

  const fetchDailyPlan = async () => {
    try {
      setLoadingPlan(true);
      const res = await api.get('/ai/plan');
      setDailyPlan(res.data.plan);
    } catch (err) {
      setDailyPlan("Nie udało się pobrać strategii AI. Spróbuj ponownie.");
    } finally {
      setLoadingPlan(false);
    }
  };

  const [editingTask, setEditingTask] = useState(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  const handleEditClick = (task) => {
    setEditingTask(task);
    setIsEditModalOpen(true);
  };

  const handleSaveEdit = async (id, updatedData) => {
    await updateTask(id, updatedData);
  };

  const recentTasks = tasks.filter(t => t.status !== 'DONE').slice(0, 4); 

  return (
    <div className="space-y-6">
      
      <div className="bg-gradient-to-r from-primary to-purple rounded-2xl p-6 md:p-8 text-text-main shadow-xl relative overflow-hidden transition-all duration-300">
        
        <div className="relative z-10">
          <div className="flex justify-between items-start mb-4">
            <div>
              <h1 className="text-3xl font-bold flex items-center gap-2">
                Dzień dobry! 👋
              </h1>
              <p className="text-text-accent opacity-90 mt-1">
                Masz {tasks.filter(t => t.status !== 'DONE').length} zadań do wykonania.
              </p>
            </div>
            
            {dailyPlan && !loadingPlan && (
              <button 
                onClick={fetchDailyPlan} 
                className="p-2 bg-white/10 hover:bg-white/20 rounded-lg transition-colors text-white/80 hover:text-white"
                title="Wygeneruj nową strategię"
              >
                <RefreshCw size={18} />
              </button>
            )}
          </div>

          <div className="min-h-[60px] flex items-center">
            
            {loadingPlan && (
              <div className="flex items-center gap-3 text-text-accent animate-pulse">
                <Loader2 className="animate-spin" size={24} />
                <span className="text-lg">Analizuję Twój kalendarz i zadania...</span>
              </div>
            )}

            {!dailyPlan && !loadingPlan && (
              <div className="w-full">
                <p className="text-text-accent mb-4 text-sm md:text-base max-w-xl">
                  Nie wiesz od czego zacząć? Pozwól AI przeanalizować Twój kalendarz i zadania, aby ułożyć optymalną strategię na resztę dnia.
                </p>
                <button 
                  onClick={fetchDailyPlan}
                  className="group flex items-center gap-2 px-5 py-2.5 bg-text-main text-primary font-bold rounded-full shadow-lg hover:bg-surface-10 transition-all hover:scale-105 active:scale-95"
                >
                  <Sparkles size={18} className="text-yellow group-hover:rotate-12 transition-transform" />
                  Generuj Plan Dnia
                </button>
              </div>
            )}

            {dailyPlan && !loadingPlan && (
              <div className="bg-white/10 rounded-xl p-4 backdrop-blur-sm border border-white/10 w-full animate-in fade-in slide-in-from-bottom-2 duration-500">
                <div className="flex items-start gap-3">
                  <Bot className="shrink-0 mt-1 text-text-accent" size={24} />
                  <p className="text-text-main leading-relaxed whitespace-pre-line text-sm md:text-base">
                    {dailyPlan}
                  </p>
                </div>
              </div>
            )}

          </div>
        </div>
        
        <Sparkles className="absolute right-6 top-6 text-white/10 w-40 h-40 rotate-12 pointer-events-none" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-surface border border-border rounded-2xl p-1 shadow-lg">
             <TaskInput onAddTask={addTask} />
          </div>

          <div>
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold text-text-main">Najbliższe zadania</h2>
              <Link to="/dashboard/tasks" className="text-sm text-primary hover:text-primary-hover flex items-center gap-1">
                Zobacz wszystkie <ArrowRight size={14} />
              </Link>
            </div>
            
            <div className="space-y-3">
              {recentTasks.length > 0 ? (
                recentTasks.map(task => (
                  <TaskCard 
                    key={task._id} 
                    task={task} 
                    onStatusChange={updateTaskStatus}
                    onDelete={deleteTask}
                    onEdit={handleEditClick}
                  />
                ))
              ) : (
                <div className="text-center py-10 text-text-muted bg-surface-50 rounded-xl border border-dashed border-border">
                  Brak zadań na teraz. Jesteś na bieżąco!
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="h-80">
            <MiniCalendar />
          </div>
          <div className="h-96">
            <QuickNotes />
          </div>
        </div>
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

export default Dashboard;