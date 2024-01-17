import { FiberNode, REACT_ELEMENT } from "../types";

export let nextFiber: FiberNode | null = null;
export let rootFiber: FiberNode | null = null;

export function setNextFiber(fiber: FiberNode) {
	nextFiber = fiber;
}
export function setRootFiber(fiber: FiberNode | null) {
	rootFiber = fiber;
}
function commitHostComponent(fiber: FiberNode) {
	fiber.dom =
		fiber.type === REACT_ELEMENT.TEXT_ELEMENT
			? document.createTextNode("")
			: document.createElement(fiber.type as string);
	// 处理props updateProps
	for (const prop of Object.keys(fiber.props)) {
		if (prop !== "children") {
			fiber.dom[prop] = fiber.props[prop];
		}
	}
	const children = fiber.props.children;
	commitChildrenFiber(children, fiber);
}
function commitFunctionComponent(fiber: FiberNode) {
	if (typeof fiber.type === "string") return;
	const children = [fiber.type(fiber.props)];
	commitChildrenFiber(children, fiber);
}
function commitChildrenFiber(children: Array<any>, fiber: FiberNode) {
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
}

function findNextUnitOfWork(fiber: FiberNode): FiberNode | null {
	if (fiber.child) {
		return fiber.child;
	}

	let currentFiber: FiberNode | null = fiber;
	while (currentFiber) {
		if (currentFiber.sibling) {
			return currentFiber.sibling;
		}
		currentFiber = currentFiber.parent;
	}

	return null;
}
export function performUnitOfWork(fiber: FiberNode) {
	// 处理dom
	const isFunctionComponent = typeof fiber.type === "function";
	if (isFunctionComponent) {
		commitFunctionComponent(fiber);
	} else {
		commitHostComponent(fiber);
	}
	return findNextUnitOfWork(fiber);
}

function commitRoot(fiber: FiberNode) {
	if (!fiber) return;
	/**
	 * 例如：有一个function component为<Foo/>
	 * 目的：把<Foo/>里的节点挂载到<Foo/>的parent上
	 */
	while (fiber.parent && !fiber.parent.dom) {
		fiber.parent = fiber.parent.parent;
	}
	const container = fiber.parent?.dom as HTMLElement;
	fiber.dom && container.append(fiber.dom);
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
		// 遍历完成后统一提交
		rootFiber.child && commitRoot(rootFiber.child);
		rootFiber = null;
	}
	requestIdleCallback(workLoop);
}
