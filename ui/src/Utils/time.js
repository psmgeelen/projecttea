function toTimeStr(diff) {
  const seconds = Math.floor(diff / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);

  const secondsStr = (seconds % 60).toString().padStart(2, '0');
  const minutesStr = (minutes % 60).toString().padStart(2, '0');
  const hoursStr = hours.toString().padStart(2, '0');

  return `${hoursStr}:${minutesStr}:${secondsStr}`;
}

export function timeBetweenAsString({endTime=null, startTime=null, bounded=false}) {
  if (null === startTime) startTime = new Date();
  if (null === endTime) endTime = new Date();

  let diff = endTime - startTime; // in ms
  if (bounded && (diff < 0)) diff = 0;

  if (diff < 0) return '-' + toTimeStr(-diff);
  return toTimeStr(diff);
}