function today() {
  const now = new Date();
  const offset = now.getTimezoneOffset() * 60000;
  const localDate = new Date(now - offset);
  const formattedDate = localDate.toISOString().split('T')[0];
  return formattedDate;
}

function currentTime() {
  const now = new Date();
  let hours = now.getHours();
  const minutes = now.getMinutes();
  const ampm = hours >= 12 ? 'PM' : 'AM';
  hours = hours % 12;
  hours = hours ? hours : 12; // the hour '0' should be '12'
  const strHours = hours < 10 ? '0' + hours : hours;
  const strMinutes = minutes < 10 ? '0' + minutes : minutes;
  return strHours + ':' + strMinutes + ' ' + ampm;
}

function convertTime12to24(time12h) {
  const [time, modifier] = time12h.split(/(AM|PM)/);
  let [hours, minutes] = time.split(':');
  if (hours === '12') {
    hours = '00';
  }
  if (modifier === 'PM') {
    hours = parseInt(hours, 10) + 12;
  }
  return `${hours}:${minutes}`;
}

function convertTime24to12(time24h) {
  const [hours24, minutes, seconds] = time24h.split(':');
  const hours12 = ((parseInt(hours24, 10) + 11) % 12) + 1; // Convert 24h to 12h format
  const modifier = parseInt(hours24, 10) >= 12 ? 'PM' : 'AM';

  return `${hours12}:${minutes}${modifier}`;
}

function sortItemsByTimestampDesc(items) {
  return items.sort((a, b) => {
    const timeA = convertTime12to24(a.timestamp);
    const timeB = convertTime12to24(b.timestamp);
    return timeB.localeCompare(timeA); // For descending order
  });
}

export { today, currentTime, convertTime12to24, convertTime24to12, sortItemsByTimestampDesc };
