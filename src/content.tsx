import ReactDOM from "react-dom/client";
import "./content.css";
import Summary from "./components/Summary";
import type { PhishResponse } from "./types";
const READING_PANE_ID = "ReadingPaneContainerId";
const READING_PANE_INNER_ID = "ConversationReadingPaneContainer";
import styles from "./content.css?inline";

function injectSummary(resp: PhishResponse) {
	const readingPaneInner = document.getElementById(READING_PANE_INNER_ID);
	if (!readingPaneInner) return;
	if (summary) summary.remove();

	queueMicrotask(() => {
		const host = document.createElement("div");
		summary = host;
		readingPaneInner.insertBefore(host, readingPaneInner.children[1]);

		const shadow = host.attachShadow({ mode: "open" });

		const styleTag = document.createElement("style");
		styleTag.textContent = styles;
		shadow.appendChild(styleTag);

		const container = document.createElement("div");
		shadow.appendChild(container);

		const root = ReactDOM.createRoot(container);
		root.render(<Summary verdict={resp.verdict} message={resp.message} />);
	});
}

function extractLinksFromHTML(html: string): string[] {
	const links = new Set<string>();

	const doc = new DOMParser().parseFromString(html, "text/html");
	doc.querySelectorAll("a[href]").forEach((a) => {
		const href = a.getAttribute("href");
		if (href && /^https?:\/\//i.test(href)) links.add(href);
	});

	const text = doc.body.textContent || "";

	const regex = /(https?:\/\/[^\s<>"']+|www\.[^\s<>"']+)/gi;
	const matches = text.match(regex);
	if (matches)
		matches.forEach((url) => {
			if (!/^https?:\/\//i.test(url)) url = "https://" + url;
			links.add(url);
		});

	return Array.from(links);
}

let last: string | null = "";
let summary: HTMLElement | null = null;
let observer: MutationObserver | null = null;

async function scrapeEmail() {
	const container = document.getElementById(READING_PANE_ID);
	if (!container) return;

	const subjectEl = document.querySelector(
		"#ReadingPaneContainerId [role='heading']"
	);
	const subject = subjectEl ? subjectEl.textContent.trim() : null;

	if (last === subject) return;
	last = subject;

	await waitForEmailBody(container);

	const bodyText = container.innerHTML;

	let links: string[] = [];
	try {
		links = extractLinksFromHTML(bodyText);
		console.log("Extracted links:", links);
	} catch (err) {
		console.error("Link extraction failed:", err);
	}

	try {
		if (summary) summary.remove();
		const response = await chrome.runtime.sendMessage({
			type: "EMAIL_OPENED",
			payload: {
				body: {
					links,
				},
			},
		});
		injectSummary(response);
	} catch (error) {
		console.error("Error communicating with background:", error);
		injectSummary({
			verdict: "WARNING",
			message: "Could not analyze email",
		});
	}
}

function waitForEmailBody(container: HTMLElement): Promise<void> {
	return new Promise((resolve) => {
		let checks = 0;

		const interval = setInterval(() => {
			if (
				container.querySelector("a") ||
				container.innerText.length > 100
			) {
				clearInterval(interval);
				resolve();
			}

			checks++;
			if (checks > 50) {
				clearInterval(interval);
				resolve();
			}
		}, 100);
	});
}

function watchReadingPane() {
	const pane = document.getElementById(READING_PANE_ID);
	if (!pane) {
		setTimeout(watchReadingPane, 1000);
		return;
	}

	observer = new MutationObserver(() => {
		scrapeEmail();
	});
	observer.observe(pane, { childList: true, subtree: true });
}

let lastUrl = location.href;
const urlObserver = new MutationObserver(() => {
	if (location.href !== lastUrl) {
		lastUrl = location.href;
		if (/mail/i.test(location.href)) {
			scrapeEmail();
		}
	}
});
urlObserver.observe(document.body, { childList: true, subtree: true });

watchReadingPane();
