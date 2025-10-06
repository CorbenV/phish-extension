chrome.runtime.onMessage.addListener((message) => {
	if (message["type"] == "EMAIL_OPENED") {
		console.log("Background got:", message);
	}
	return true;
});
