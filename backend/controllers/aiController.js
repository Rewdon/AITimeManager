const Task = require('../models/Task');
const Event = require('../models/Event');
const { generateDailyPlan } = require('../services/geminiService');
const { startOfDay, endOfDay } = require('date-fns');

const getDailyPlan = async (req, res) => {
  try {
    const today = new Date();
    
    const tasks = await Task.find({ 
      user: req.user._id, 
      status: { $ne: 'DONE' } 
    });

    const events = await Event.find({
      user: req.user._id,
      start: { 
        $gte: startOfDay(today), 
        $lte: endOfDay(today) 
      }
    }).sort({ start: 1 });

    const formattedEvents = events.map(e => ({
      time: e.start.toLocaleTimeString('pl-PL', { hour: '2-digit', minute: '2-digit' }),
      title: e.title,
      duration: (new Date(e.end) - new Date(e.start)) / 60000
    }));

    const planText = await generateDailyPlan(tasks, formattedEvents, req.user.name);

    res.json({ plan: planText });

  } catch (error) {
    console.error("AI Controller Error:", error);
    res.status(500).json({ message: 'Błąd generowania planu' });
  }
};

module.exports = { getDailyPlan };