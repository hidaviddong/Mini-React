import type { ReactElement } from "../types";
import { setNextFiber, setRootFiber, nextFiber, workLoop } from "./Scheduler";

function render(reactNode: ReactElement, container: HTMLElement) {
	// 第一次调用
	setNextFiber({
		type: reactNode.type,
		props: {
			children: [reactNode],
		},
		sibling: null,
		child: null,
		return: null,
		parent: null,
		index: 0,
		dom: container,
	});
	setRootFiber(nextFiber);
}

export function createRoot(domNode: HTMLElement) {
	return {
		render(reactNode: ReactElement) {
			return render(reactNode, domNode);
		},
	};
}
requestIdleCallback(workLoop);
