function main() {
  var checkoutButton = document.getElementsByClassName("large orange checkout")[0];
  var oldOnClick = checkoutButton.onclick;
  checkoutButton.onclick = function() {
    didPressCheckoutButton();
    if (oldOnClick) oldOnClick();
  };
}

function didPressCheckoutButton() {
  try {
    chrome.runtime.sendMessage({say: "didPressCheckoutButton"}, function(resp) {
      console.log("'remuncher' extension says: " + resp.result);
    });
  } catch(e) {
    alert(e);
  }
}

main();
