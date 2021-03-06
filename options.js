var defaults = {
  startHour: 9,
  endHour: 14,
  skipWeekends: true,
  checkoutButtonClassName: "large orange checkout"
}

function getHourFromInputVals(startOrEndStr) {
  var startOrEndHourStr = startOrEndStr + 'Hour';
  var hourNumber = parseInt(document.getElementById(startOrEndHourStr + 'Number').value);
  if (isNaN(hourNumber)) return defaults[startOrEndHourStr];
  var hourPeriod = document.getElementById(startOrEndHourStr + 'Period').value;
  if (hourPeriod === 'am' && hourNumber == 12) {
    hourNumber = 0;
  } else if (hourPeriod === 'pm' && hourNumber != 12) {
    hourNumber += 12;
  }
  return hourNumber;
}

function setInputValsFromHour(hour, startOrEndStr) {
  var startOrEndHourStr = startOrEndStr + 'Hour';
  var hourNumber = hour;
  var hourPeriod = 'am';
  if (hour >= 12) {
    hourPeriod = 'pm';
    hourNumber -= 12;
  }
  if (hourNumber == 0) {
    hourNumber = 12;
  }
  document.getElementById(startOrEndHourStr + 'Number').value = '' + hourNumber;
  document.getElementById(startOrEndHourStr + 'Period').value = hourPeriod;
}

function getStartHourFromInputVals() { return getHourFromInputVals('start'); }
function setInputValsFromStartHour(startHour) { return setInputValsFromHour(startHour, 'start'); }
function getEndHourFromInputVals() { return getHourFromInputVals('end'); }
function setInputValsFromEndHour(endHour) { return setInputValsFromHour(endHour, 'end'); }

// Saves options to chrome.storage
function saveOptions() {
  var skipWeekends = document.getElementById('skipWeekends').checked;
  var checkoutButtonClassName = document.getElementById('checkoutButtonClassName').value;
  chrome.storage.sync.set({
    startHour: getStartHourFromInputVals(),
    endHour: getEndHourFromInputVals(),
    skipWeekends: skipWeekends,
    checkoutButtonClassName: checkoutButtonClassName
  }, function() {
    var statusElem = document.getElementById('status');
    statusElem.textContent = 'Options saved';
    setTimeout(function() {
      statusElem.textContent = '';
    }, 750);
    didSaveOptions();
  });
}

function didSaveOptions() {
  chrome.runtime.sendMessage({say: "didSaveOptions"}, function(resp) {
    console.log("'remuncher' extension says: " + resp.result);
  });
}

// Restores options from chrome.storage
function restoreOptions() {
  chrome.storage.sync.get({
    startHour: defaults.startHour,
    endHour: defaults.endHour,
    skipWeekends: defaults.skipWeekends,
    checkoutButtonClassName: defaults.checkoutButtonClassName
  }, function(items) {
    setInputValsFromStartHour(items.startHour);
    setInputValsFromEndHour(items.endHour);
    document.getElementById('skipWeekends').checked = items.skipWeekends;
    document.getElementById('checkoutButtonClassName').value = items.checkoutButtonClassName;
  });
}

document.addEventListener('DOMContentLoaded', restoreOptions);
document.getElementById('save').addEventListener('click', saveOptions);
