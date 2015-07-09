function scheduleNextAlarm() {
  chrome.alarms.create('refresh', {when: timeOfNextWakeUp()});
}

function shouldShowAlarm() {
  //return hasNotOrderedYet
  return true;
}

function onAlarm(alarm) {
  if (shouldShowAlarm()) {
    alert("Don't forget to order Munchery!");
  }
  scheduleNextAlarm();
}

function timeOfNextWakeUp() {
  var now = new Date();
  now.setMinutes(0);
  now.setSeconds(0);
  if (now.getHours() >= 9 && now.getHours() < 14) { //between 9am and 2pm
    now.setHours(now.getHours() + 1);
  } else {
    now.setHours(9);
    now.setDate(now.getDate() + 1); //what about weekends?
  }
  return now.getTime();
}

chrome.alarms.onAlarm.addListener(onAlarm);
scheduleNextAlarm();
