import { REACT_ELEMENT, type ReactElement } from "../types";

function render(reactNode: ReactElement, container: HTMLElement) {
	const dom =
		reactNode.type === REACT_ELEMENT.TEXT_ELEMENT
			? document.createTextNode("")
			: document.createElement(reactNode.type);

	for (const prop of Object.keys(reactNode.props)) {
		if (prop !== "children") {
			dom[prop] = reactNode.props[prop];
		}
	}
	for (const child of reactNode.props.children) {
		render(child, dom as HTMLElement);
	}
	container.appendChild(dom);
}

export function createRoot(domNode: HTMLElement) {
	return {
		render(reactNode: ReactElement) {
			return render(reactNode, domNode);
		},
	};
}
