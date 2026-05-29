const Task = require('../models/Task');

const { analyzeTaskWithAI } = require('../services/geminiService');

const estimateTaskAI = (title) => {
    const titleLower = title.toLowerCase();
    
    let type = 'ACTIVE';
    let time = 30;

    if (titleLower.includes('czekam') || 
        titleLower.includes('pobieranie') || 
        titleLower.includes('renderowanie') || 
        titleLower.includes('wysyłanie') ||
        titleLower.includes('pranie')) {
        type = 'PASSIVE';
        time = 60;
    }

    if (titleLower.includes('telefon') || titleLower.includes('mail') || titleLower.includes('sprawdź')) {
        time = 15;
    }
    
    if (titleLower.includes('napisz') || titleLower.includes('raport') || titleLower.includes('analiza')) {
        time = 90;
    }

    return { taskType: type, estimatedTime: time };
};
const getTasks = async (req, res) => {
    try {
        const tasks = await Task.find({ user: req.user._id }).sort({ createdAt: -1 });
        res.json(tasks);
    } catch (error) {
        res.status(500).json({ message: 'Błąd podczas pobierania zadań', error: error.message });
    }
};

const createTask = async (req, res) => {
    let { title, description, taskType, estimatedTime, priority } = req.body;

    if (!title) {
        return res.status(400).json({ message: 'Tytuł zadania jest wymagany' });
    }

    try {
        let aiResult = null;
        
        if (!taskType || !estimatedTime || !priority || priority === 'medium') {
            console.log(`AI analizuje: "${title}"...`);
            aiResult = await analyzeTaskWithAI(title, description);
            console.log("Wynik z Gemini:", aiResult);
        }

        if (!taskType && aiResult?.taskType) {
            taskType = aiResult.taskType;
        }
        let finalTaskType = (taskType || 'ACTIVE').toString().toUpperCase().trim();
        if (!['ACTIVE', 'PASSIVE'].includes(finalTaskType)) finalTaskType = 'ACTIVE';

        if (!estimatedTime && aiResult?.estimatedTime) {
            estimatedTime = aiResult.estimatedTime;
        }
        const finalEstimatedTime = estimatedTime || 30;

        let finalPriority = priority;
        
        if ((!finalPriority || finalPriority === 'medium') && aiResult?.priority) {
             finalPriority = aiResult.priority.toLowerCase();
        }
        
        if (!['low', 'medium', 'high'].includes(finalPriority)) {
            finalPriority = 'medium';
        }

        console.log("ZAPISUJĘ:", { 
            title, 
            taskType: finalTaskType, 
            priority: finalPriority 
        });

        const task = await Task.create({
            user: req.user._id,
            title,
            description,
            taskType: finalTaskType,
            estimatedTime: finalEstimatedTime,
            priority: finalPriority
        });

        res.status(201).json(task);
    } catch (error) {
        console.error("Błąd tworzenia zadania:", error);
        res.status(500).json({ message: 'Błąd serwera', error: error.message });
    }
};

const updateTask = async (req, res) => {
    try {
        const task = await Task.findById(req.params.id);
        if (!task) return res.status(404).json({ message: 'Nie znaleziono zadania' });
        if (task.user.toString() !== req.user._id.toString()) return res.status(401).json({ message: 'Brak uprawnień' });
        const updatedTask = await Task.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.json(updatedTask);
    } catch (error) { res.status(500).json({ message: 'Błąd aktualizacji' }); }
};

const deleteTask = async (req, res) => {
    try {
        const task = await Task.findById(req.params.id);
        if (!task) return res.status(404).json({ message: 'Nie znaleziono zadania' });
        if (task.user.toString() !== req.user._id.toString()) return res.status(401).json({ message: 'Brak uprawnień' });
        await task.deleteOne();
        res.json({ message: 'Zadanie usunięte' });
    } catch (error) { res.status(500).json({ message: 'Błąd usuwania' }); }
};

module.exports = { getTasks, createTask, updateTask, deleteTask };