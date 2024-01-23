import { FiberNode, REACT_ELEMENT, FiberNodeFunctionType } from "../types";
import type { ReactElement } from "../types";
let nextWorkOfUnit: FiberNode;
let root: FiberNode | null;
let currentRoot: FiberNode;
let oldFiberArray: Array<FiberNode>;
function workLoop(deadline: IdleDeadline) {
	let shouldYield = false;

	while (!shouldYield && nextWorkOfUnit) {
		nextWorkOfUnit = performUnitOfWork(nextWorkOfUnit) as FiberNode;
		shouldYield = deadline.timeRemaining() < 1;
	}
	if (!nextWorkOfUnit && root) {
		commitRoot();
	}
	requestIdleCallback(workLoop);
}

function commitRoot() {
	typeof oldFiberArray === "object" && oldFiberArray.forEach(commitDelete);
	root?.child && commitWork(root.child);
	if (root) {
		currentRoot = root;
	}
	root = null;
	oldFiberArray = [];
}
function commitDelete(fiber: FiberNode) {
	if (fiber.dom) {
		let fiberParent = fiber.parent;
		while (!fiberParent?.dom) {
			fiberParent = fiberParent?.parent;
		}
		fiberParent.dom?.removeChild(fiber.dom);
	} else {
		fiber.child && commitDelete(fiber.child);
	}
}

function commitWork(fiber: FiberNode) {
	if (!fiber) return;
	/**
	 * 例如：有一个function component为<Foo/>
	 * 目的：把<Foo/>里的节点挂载到<Foo/>的parent上
	 */
	let fiberParent = fiber.parent;
	while (!fiberParent?.dom) {
		fiberParent = fiberParent?.parent;
	}
	if (fiber.effectTag === "update") {
		updateProps(fiber);
	} else if (fiber.effectTag === "create") {
		if (fiber.dom) {
			fiberParent.dom.appendChild(fiber.dom);
		}
	}
	fiber.child && commitWork(fiber.child);
	fiber.sibling && commitWork(fiber.sibling);
}

function createDOM(type) {
	return type === REACT_ELEMENT.TEXT_ELEMENT
		? document.createTextNode("")
		: document.createElement(type);
}

function updateProps(fiber: FiberNode) {
	const dom = fiber.dom;
	const nextProps = fiber.props;
	const prevProps = fiber.alternate?.props || {};
	const isProperty = (k) => k !== "children";
	// 旧树中有 新树中没有
	for (const prop of Object.keys(prevProps).filter(isProperty)) {
		if (!(prop in nextProps)) {
			dom instanceof HTMLElement && dom.removeAttribute(prop);
		}
	}
	// 新树有，旧树有，diff值
	for (const prop of Object.keys(nextProps).filter(isProperty)) {
		if (nextProps[prop] !== prevProps[prop]) {
			if (prop.startsWith("on")) {
				const eventName = prop.slice(2).toLowerCase();
				dom?.removeEventListener(eventName, prevProps[prop]);
				dom?.addEventListener(eventName, nextProps[prop]);
			} else {
				if (dom) {
					dom[prop] = nextProps[prop];
				}
			}
		}
	}
}

function initChildren(children: Array<any>, fiber: FiberNode) {
	let oldFiber = fiber.alternate?.child;
	let prevChild: FiberNode;
	children.forEach((child, index) => {
		const isSameType = oldFiber && oldFiber?.type === child.type;
		let newFiber: FiberNode;
		if (isSameType) {
			// update(diff)
			newFiber = {
				type: child.type,
				props: child.props,
				child: null,
				parent: fiber,
				dom: oldFiber?.dom || null,
				sibling: null,
				alternate: oldFiber,
				effectTag: "update",
			};
		} else {
			newFiber = {
				type: child.type,
				props: child.props,
				child: null,
				parent: fiber,
				dom: null,
				sibling: null,
				alternate: null,
				effectTag: "create",
			};
			if (oldFiber) {
				oldFiberArray.push(oldFiber);
			}
		}
		if (oldFiber) {
			oldFiber = oldFiber.sibling;
		}
		if (index === 0) {
			fiber.child = newFiber;
		} else {
			prevChild.sibling = newFiber;
		}
		prevChild = newFiber;
	});
}

function updateFunctionComponent(fiber: FiberNode) {
	const fiberType = fiber.type as FiberNodeFunctionType;
	const children = [fiberType(fiber.props)];
	initChildren(children, fiber);
}

function updateHostComponent(fiber: FiberNode) {
	if (!fiber.dom) {
		fiber.dom = createDOM(fiber.type);
		updateProps(fiber);
	}
	initChildren(fiber.props.children, fiber);
}

export function performUnitOfWork(fiber: FiberNode) {
	const isFunctionComponent = typeof fiber.type === "function";
	if (isFunctionComponent) {
		updateFunctionComponent(fiber);
	} else {
		updateHostComponent(fiber);
	}

	if (fiber.child) {
		return fiber.child;
	}

	let nextFiber: FiberNode = fiber;
	// 没有子节点返回兄弟节点
	while (nextFiber) {
		if (nextFiber.sibling) {
			return nextFiber.sibling;
		}
		nextFiber = nextFiber.parent as FiberNode;
	}
}

export function render(el: ReactElement, container: HTMLElement) {
	nextWorkOfUnit = {
		dom: container,
		props: {
			children: [el],
		},
	};

	root = nextWorkOfUnit;
}

export function update() {
	nextWorkOfUnit = {
		dom: currentRoot.dom,
		props: currentRoot.props,
		alternate: currentRoot,
	};

	root = nextWorkOfUnit;
}

requestIdleCallback(workLoop);
