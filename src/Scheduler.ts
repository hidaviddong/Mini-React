import { FiberNode, REACT_ELEMENT } from "../types";

export let nextFiber: FiberNode | null = null;
export let rootFiber: FiberNode | null = null;
export function setNextFiber(fiber: FiberNode) {
	nextFiber = fiber;
}
export function setRootFiber(fiber: FiberNode | null) {
	rootFiber = fiber;
}

export function performUnitOfWork(fiber: FiberNode) {
	// 处理dom
	if (!fiber.dom) {
		fiber.dom =
			fiber.type === REACT_ELEMENT.TEXT_ELEMENT
				? document.createTextNode("")
				: document.createElement(fiber.type);

		const dom = fiber.dom;
		const container = fiber.parent?.dom as HTMLElement;
		container.append(dom);
		// 处理props
		for (const prop of Object.keys(fiber.props)) {
			if (prop !== "children") {
				dom[prop] = fiber.props[prop];
			}
		}
	}
	// 构造fiber架构

	const children = fiber.props.children;
	let prevChild: FiberNode | null = null;
	children.forEach((child, index) => {
		const newWork: FiberNode = {
			type: child.type,
			props: child.props,
			child: null,
			parent: fiber,
			sibling: null,
			dom: null,
			return: null,
			index: 0,
		};
		if (index === 0) {
			fiber.child = newWork;
		} else {
			if (prevChild) {
				prevChild.sibling = newWork;
			}
		}
		prevChild = newWork;
	});

	if (fiber.child) {
		return fiber.child;
	}
	if (fiber.sibling) {
		return fiber.sibling;
	}
	return fiber.parent?.sibling || null;
}

export function workLoop(deadline: IdleDeadline) {
	let shouldYield = false;

	while (!shouldYield && nextFiber) {
		nextFiber = performUnitOfWork(nextFiber);
		shouldYield = deadline.timeRemaining() < 1;
	}
	requestIdleCallback(workLoop);
}
