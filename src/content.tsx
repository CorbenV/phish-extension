import ReactDOM from "react-dom/client";
import "./content.css";
import Summary from "./components/Summary";
const READING_PANE_ID = "ReadingPaneContainerId";
import styles from "./content.css?inline";

let observer: MutationObserver | null = null;
let last = "";
let summary: HTMLElement | null = null;

function injectSummary(parent: HTMLElement) {
	if (summary) summary.remove();

	const host = document.createElement("div");
	summary = host;
	parent.appendChild(host);

	const shadow = host.attachShadow({ mode: "open" });

	const styleTag = document.createElement("style");
	styleTag.textContent = styles;
	shadow.appendChild(styleTag);

	const container = document.createElement("div");
	shadow.appendChild(container);

	const root = ReactDOM.createRoot(container);
	root.render(<Summary />);
}

function scrapeEmail() {
	const container = document.getElementById(READING_PANE_ID);
	if (!container) return;

	const bodyText = container.innerText;
	const preview = bodyText.slice(0, 100);

	if (last == preview) return;
	last = preview;

	injectSummary(container);

	chrome.runtime.sendMessage({
		type: "EMAIL_OPENED",
		payload: { body: bodyText },
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
