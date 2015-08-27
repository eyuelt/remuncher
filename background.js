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
  chrome.alarms.create("refresh", {when: timeOfNextWakeUp()});
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
    alert("Reminders turned off for today");
  });
}

function onExtensionButtonClicked(tab) {
  turnOffReminders();
}

function timeOfNextWakeUp() {
  var now = new Date();
  now.setMinutes(0);
  now.setSeconds(0);
  if (now.getHours() >= 9 && now.getHours() < 14) { //between 9am and 2pm
    now.setHours(now.getHours() + 1);
  } else {
    now.setHours(9);
    now.setDate(now.getDate() + (now.getDay() == 5 ? 3 : 1));
  }
  return now.getTime();
}

chrome.alarms.onAlarm.addListener(onAlarm);
chrome.browserAction.onClicked.addListener(onExtensionButtonClicked);
scheduleNextAlarm();

function handleMessage(request, sender, sendResponse) {
  var result = "did nothing";
  var success = false;
  if (request.say == "didPressCheckoutButton") {
    turnOffReminders();
    result = "turned off reminders for today";
    success = true;
  }
  sendResponse({result: result, success: success});
}

chrome.runtime.onMessage.addListener(handleMessage);
