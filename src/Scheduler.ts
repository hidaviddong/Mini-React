import { FiberNode, REACT_ELEMENT } from "../types";

export let nextWorkOfUnit: FiberNode | null = null;
export let rootFiber: FiberNode | null = null;
export function setNextWorkOfUnit(workOfUnit: FiberNode) {
	nextWorkOfUnit = workOfUnit;
}
export function setRootFiber(fiber: FiberNode | null) {
	rootFiber = fiber;
}

export function performUnitOfWork(workUnit: FiberNode) {
	// 处理dom
	if (!workUnit.dom) {
		workUnit.dom =
			workUnit.type === REACT_ELEMENT.TEXT_ELEMENT
				? document.createTextNode("")
				: document.createElement(workUnit.type);

		const dom = workUnit.dom;
		const container = workUnit.parent?.dom as HTMLElement;
		container.append(dom);
		// 处理props
		for (const prop of Object.keys(workUnit.props)) {
			if (prop !== "children") {
				dom[prop] = workUnit.props[prop];
			}
		}
	}
	// 构造fiber架构

	const children = workUnit.props.children;
	let prevChild: FiberNode | null = null;
	children.forEach((child, index) => {
		const newWork: FiberNode = {
			type: child.type,
			props: child.props,
			child: null,
			parent: workUnit,
			sibling: null,
			dom: null,
			return: null,
			index: 0,
		};
		if (index === 0) {
			workUnit.child = newWork;
		} else {
			if (prevChild) {
				prevChild.sibling = newWork;
			}
		}
		prevChild = newWork;
	});

	if (workUnit.child) {
		return workUnit.child;
	}
	if (workUnit.sibling) {
		return workUnit.sibling;
	}
	return workUnit.parent?.sibling || null;
}

export function workLoop(deadline: IdleDeadline) {
	let shouldYield = false;

	while (!shouldYield && nextWorkOfUnit) {
		console.log(nextWorkOfUnit);
		nextWorkOfUnit = performUnitOfWork(nextWorkOfUnit);
		shouldYield = deadline.timeRemaining() < 1;
	}
	requestIdleCallback(workLoop);
}
