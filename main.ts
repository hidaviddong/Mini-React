import { createElement } from "./src/React";
import { createRoot } from "./src/ReactDOM";

const domNode = createRoot(document.getElementById("app") as HTMLElement);
const reactElement = createElement(
	"h1",
	{ className: "greeting", id: "hahaha" },
	"Hello",
	"World",
);
domNode.render(reactElement);
