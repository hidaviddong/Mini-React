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
	if (typeof fiber.type !== "function" && !fiber.dom) {
		// createFiberDOM
		fiber.dom =
			fiber.type === REACT_ELEMENT.TEXT_ELEMENT
				? document.createTextNode("")
				: document.createElement(fiber.type);
		// 处理props updateProps
		for (const prop of Object.keys(fiber.props)) {
			if (prop !== "children") {
				fiber.dom[prop] = fiber.props[prop];
			}
		}
	}

	// 构造fiber架构 createFiber
	// 区分function component 的情况
	const children =
		typeof fiber.type === "function"
			? [fiber.type(fiber.props)]
			: fiber.props.children;
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
	let _fiber: FiberNode | null = fiber;
	// 解决多个组件传props时渲染失败的问题
	while (_fiber) {
		if (_fiber.sibling) return _fiber.sibling;
		_fiber = _fiber.parent;
	}
	return null;
}

function commitRoot(fiber: FiberNode) {
	if (!fiber) return;

	while (fiber.parent && !fiber.parent.dom) {
		fiber.parent = fiber.parent.parent;
	}
	const dom = fiber.dom;
	const container = fiber.parent?.dom as HTMLElement;
	dom && container.append(dom);
	fiber.child && commitRoot(fiber.child);
	fiber.sibling && commitRoot(fiber.sibling);
}

export function workLoop(deadline: IdleDeadline) {
	let shouldYield = false;

	while (!shouldYield && nextFiber) {
		nextFiber = performUnitOfWork(nextFiber);
		shouldYield = deadline.timeRemaining() < 1;
	}
	if (!nextFiber && rootFiber) {
		// 统一提交
		rootFiber.child && commitRoot(rootFiber.child);
		rootFiber = null;
	}
	requestIdleCallback(workLoop);
}
