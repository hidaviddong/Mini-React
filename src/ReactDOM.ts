import type { ReactElement } from "../types";
import {
	setNextWorkOfUnit,
	setRootFiber,
	nextWorkOfUnit,
	workLoop,
} from "./Scheduler";

function render(reactNode: ReactElement, container: HTMLElement) {
	setNextWorkOfUnit({
		type: reactNode.type,
		props: reactNode.props,
		sibling: null,
		child: null,
		return: null,
		parent: null,
		index: 0,
		dom: container,
	});
	setRootFiber(nextWorkOfUnit);
}

export function createRoot(domNode: HTMLElement) {
	return {
		render(reactNode: ReactElement) {
			return render(reactNode, domNode);
		},
	};
}
requestIdleCallback(workLoop);
