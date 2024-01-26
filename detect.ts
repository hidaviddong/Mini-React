import { detect } from "detect-browser";
const browser = detect();

if (browser && ["safari"].includes(browser.name)) {
	document.body.innerHTML =
		"<p>This browser can't support requestIdleCallback function, change another one! </p>";
}
