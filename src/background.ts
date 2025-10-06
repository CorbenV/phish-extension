chrome.runtime.onMessage.addListener((message) => {
	if (message["type"] == "EMAIL_OPENED") {
		console.log(message["payload"]["body"]);
	}
	return true;
});
