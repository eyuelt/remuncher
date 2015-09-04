function addListenerToCheckoutButton(className, shouldHighlight) {
  var checkoutButton = document.getElementsByClassName(className)[0];
  if (shouldHighlight) checkoutButton.style.border = "2px dotted yellow";
  var oldOnClick = checkoutButton.onclick;
  checkoutButton.onclick = function() {
    didPressCheckoutButton();
    if (oldOnClick) oldOnClick();
  };
}

function didPressCheckoutButton() {
  chrome.runtime.sendMessage({say: "didPressCheckoutButton"}, function(resp) {
    console.log("'remuncher' extension says: " + resp.result);
  });
}

function main() {
  chrome.runtime.sendMessage({say: "getCheckoutButtonClassName"}, function(resp) {
    addListenerToCheckoutButton(resp.result, false);
  });
}

main();
