export const smartSortTasks = (tasks) => {
  if (!tasks) return [];

  return [...tasks].sort((a, b) => {
    const isADone = a.status === 'DONE';
    const isBDone = b.status === 'DONE';
    
    if (isADone && !isBDone) return 1;
    if (!isADone && isBDone) return -1;

    const priorityWeight = { high: 3, medium: 2, low: 1 };
    const pA = priorityWeight[a.priority] || 2;
    const pB = priorityWeight[b.priority] || 2;
    
    if (pB !== pA) {
      return pB - pA; 
    }

    if (a.taskType === 'PASSIVE' && b.taskType === 'ACTIVE') return -1;
    if (a.taskType === 'ACTIVE' && b.taskType === 'PASSIVE') return 1;

    return (a.estimatedTime || 0) - (b.estimatedTime || 0);
  });
};