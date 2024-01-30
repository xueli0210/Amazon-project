export function isWeekend(date) {
  const dayOfTheWeek = date.format('dddd');
  
  return dayOfTheWeek === 'Saturday' || dayOfTheWeek === 'Sunday'
};