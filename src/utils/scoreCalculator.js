// utils/scoreCalculator.js
export const calculateScore = (routine) => {
  if (!routine) return 0;

  let totalTasks = 0;
  let completedTasks = 0;

  Object.values(routine).forEach(section => {
    if (section && typeof section === "object") {
      Object.values(section).forEach(task => {
        totalTasks += 1;
        if (task === true) completedTasks += 1;
      });
    }
  });

  if (totalTasks === 0) return 0;

  return Math.round((completedTasks / totalTasks) * 100);
};