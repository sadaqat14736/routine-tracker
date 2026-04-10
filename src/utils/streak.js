import dayjs from "dayjs";

export const calculateStreak = (days) => {
  if (!days.length) return { current: 0, best: 0 };

  const sorted = days
    .map((d) => d.id)
    .sort((a, b) => (a > b ? 1 : -1));

  let best = 0;
  let current = 0;
  let temp = 1;

  for (let i = 1; i < sorted.length; i++) {
    const prev = dayjs(sorted[i - 1]);
    const curr = dayjs(sorted[i]);

    if (curr.diff(prev, "day") === 1) {
      temp++;
    } else {
      best = Math.max(best, temp);
      temp = 1;
    }
  }

  best = Math.max(best, temp);

  // Current streak (from today backwards)
  let today = dayjs();
  current = 0;

  for (let i = sorted.length - 1; i >= 0; i--) {
    if (dayjs(sorted[i]).isSame(today, "day")) {
      current++;
      today = today.subtract(1, "day");
    } else if (dayjs(sorted[i]).isSame(today.subtract(1, "day"), "day")) {
      current++;
      today = today.subtract(1, "day");
    } else {
      break;
    }
  }

  return { current, best };
};