// DEBUG CODE. REMOVE WHEN IN PROD
console.warn("CURRENTLY IN DEMO MODE");

function getRandomInt(min: number, max: number) {
	min = Math.ceil(min);
	max = Math.floor(max);
	return Math.floor(Math.random() * (max - min)) + min;
}

chrome.runtime.onMessage.addListener(
	(message, _sender, sendResponse: (resp?: PhishResponse) => void) => {
		console.log(message["payload"]["body"]);
		const num = getRandomInt(0, 3);
		switch (num) {
			case 0:
				sendResponse({ verdict: "SAFE", message: "Debug Response" });
				break;
			case 1:
				sendResponse({ verdict: "WARNING", message: "Debug Response" });
				break;
			default:
				sendResponse({ verdict: "UNSAFE", message: "Debug Response" });
		}

		return true;
	}
);

// BEGIN PROD CODE

import type { PhishResponse } from "./types";
// const API_URL = "";

// let currentAbortController: AbortController | null = null;

// chrome.runtime.onMessage.addListener(
// 	(message, _sender, sendResponse: (resp?: PhishResponse) => void) => {
// 		if (message["type"] === "EMAIL_OPENED") {
// 			const { links } = message["payload"]["body"];
// 			if (!links) return;

// 			if (currentAbortController) currentAbortController.abort();

// 			currentAbortController = new AbortController();
// 			const { signal } = currentAbortController;

// 			fetch(API_URL, {
// 				method: "POST",
// 				headers: {
// 					"Content-Type": "application/json",
// 				},
// 				body: JSON.stringify({ links }),
// 				signal,
// 			})
// 				.then(async (res) => {
// 					if (!res.ok) throw new Error(await res.text());
// 					const json = await res.json().catch(() => null);
// 					if (
// 						json &&
// 						typeof json.verdict === "string" &&
// 						typeof json.message === "string"
// 					) {
// 						const out: PhishResponse = {
// 							verdict:
// 								json.verdict === "SAFE" ||
// 								json.verdict === "WARNING"
// 									? json.verdict
// 									: "UNSAFE",
// 							message: json.message,
// 						};
// 						sendResponse(out);
// 					} else {
// 						sendResponse({
// 							verdict: "WARNING",
// 							message: "Unexpected response format",
// 						});
// 					}
// 				})
// 				.catch((err) => {
// 					if (err.name === "AbortError") {
// 						console.log("Request aborted (new email opened)");
// 					} else {
// 						console.error("Upload failed:", err);
// 					}
// 				});
// 			return true;
// 		}
// 	}
// );
