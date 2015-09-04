var settings = {
  startHour: 9,
  endHour: 14,
  skipWeekends: true
}

function updateSettings(callback) {
  chrome.storage.sync.get({
    startHour: settings.startHour,
    endHour: settings.endHour,
    skipWeekends: settings.skipWeekends
  }, function(items) {
    settings.startHour = items.startHour;
    settings.endHour = items.endHour;
    settings.skipWeekends = items.skipWeekends;
    callback();
  });
}

//key for use in chrome local storage
LAST_SAVED_DATE_KEY = "last_saved_date";

function fetchLastSavedDate(callback) {
  var obj = {};
  obj[LAST_SAVED_DATE_KEY] = 0;
  chrome.storage.local.get(obj, function(items) { callback(new Date(items[LAST_SAVED_DATE_KEY])); });
}

function setLastSavedDate(lastSavedDate, callback) {
  var obj = {};
  obj[LAST_SAVED_DATE_KEY] = lastSavedDate.getTime();
  chrome.storage.local.set(obj, function() { callback(); });
}

function scheduleNextAlarm() {
  chrome.alarms.create("refresh", {when: timeOfNextWakeUp().getTime()});
}

function isNotToday(date) {
  return date !== undefined && date.getDate() !== (new Date()).getDate();
}

function onAlarm(alarm) {
  fetchLastSavedDate(function(date) {
    if (isNotToday(date)) alert("Don't forget to order Munchery!");
  });
  scheduleNextAlarm();
}

function turnOffReminders() {
  setLastSavedDate(new Date(), function() {
    alert("Turning off reminders for today!");
  });
}

function onExtensionButtonClicked(tab) {
  turnOffReminders();
}

function shouldSkipDay(date) {
  return settings.skipWeekends && (date.getDay() == 6 || date.getDay() == 0);
}

function timeOfNextWakeUp() {
  var now = new Date();
  now.setMinutes(0);
  now.setSeconds(0);
  if (!shouldSkipDay(now) && (now.getHours() >= settings.startHour && now.getHours() < settings.endHour)) {
    now.setHours(now.getHours() + 1);
  } else {
    now.setHours(settings.startHour);
    now.setDate(now.getDate() + 1);
    while (shouldSkipDay(now)) {
      now.setDate(now.getDate() + 1);
    }
  }
  return now;
}

//handle messages received from the other scripts
function onMessage(request, sender, sendResponse) {
  var result = "did nothing";
  var success = false;
  if (request.say == "didPressCheckoutButton") {
    turnOffReminders();
    result = "turned off reminders for today";
    success = true;
  } else if (request.say == "didSaveOptions") {
    updateSettings(function() {
      scheduleNextAlarm();
    });
    result = "updated next alarm time";
    success = true;
  }
  sendResponse({result: result, success: success});
}

function main() {
  chrome.alarms.onAlarm.addListener(onAlarm);
  chrome.runtime.onMessage.addListener(onMessage);
  chrome.browserAction.onClicked.addListener(onExtensionButtonClicked);
  updateSettings(function() {
    scheduleNextAlarm();
  });
}

main();
