import {
	REACT_ELEMENT,
	type ReactElement,
	type ReactElementChildren,
	type ReactElementProps,
} from "../types";

function createTextNode(nodeValue: string): ReactElement {
	return {
		type: REACT_ELEMENT.TEXT_ELEMENT,
		props: {
			nodeValue,
			children: [],
		},
	};
}
function createElement(
	type: string,
	props: ReactElementProps,
	...children: ReactElementChildren[]
): ReactElement {
	return {
		type,
		props: {
			...props,
			children: children.map((child) => {
				return typeof child === "string" ? createTextNode(child) : child;
			}),
		},
	};
}

export default {
	createElement,
};
