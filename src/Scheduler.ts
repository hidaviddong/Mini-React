import { FiberNode, REACT_ELEMENT } from "../types";

export let nextFiber: FiberNode | null = null;
export let rootFiber: FiberNode | null = null;
// currentRootFiber用于更新
let currentRootFiber: FiberNode | null = null;
export function setNextFiber(fiber: FiberNode) {
	nextFiber = fiber;
}
export function setRootFiber(fiber: FiberNode | null) {
	rootFiber = fiber;
}
function updateProps(fiber: FiberNode) {
	const dom = fiber.dom;
	const newProps = fiber.props;
	const oldProps = fiber.alternate?.props || {};
	// 旧树中有 新树中没有
	for (const prop of Object.keys(oldProps)) {
		if (prop !== "children") {
			if (!(prop in newProps)) {
				dom instanceof HTMLElement && dom.removeAttribute(prop);
			}
		}
	}
	// 新树有，旧树有，diff值
	for (const prop of Object.keys(newProps)) {
		if (prop !== "children" && newProps[prop] !== oldProps[prop]) {
			if (prop.startsWith("on")) {
				const eventName = prop.slice(2).toLowerCase();
				dom?.removeEventListener(eventName, oldProps[prop]);
				dom?.addEventListener(eventName, newProps[prop]);
			} else {
				if (dom) {
					dom[prop] = newProps[prop];
				}
			}
		}
	}
}
function commitHostComponent(fiber: FiberNode) {
	fiber.dom =
		fiber.type === REACT_ELEMENT.TEXT_ELEMENT
			? document.createTextNode("")
			: document.createElement(fiber.type as string);
	updateProps(fiber);
	commitChildrenFiber(fiber.props.children, fiber);
}
function commitFunctionComponent(fiber: FiberNode) {
	if (typeof fiber.type === "string") return;
	const children = [fiber.type(fiber.props)];
	commitChildrenFiber(children, fiber);
}
function commitChildrenFiber(children: Array<any>, fiber: FiberNode) {
	let oldFiber = fiber.alternate?.child;
	let prevChild: FiberNode | null = null;
	let newFiber: FiberNode;
	children.forEach((child, index) => {
		const isSameTag = oldFiber?.type === child.type;
		if (isSameTag && oldFiber) {
			// update(diff)
			newFiber = {
				type: child.type,
				props: child.props,
				child: null,
				parent: fiber,
				sibling: null,
				dom: oldFiber?.dom,
				alternate: oldFiber,
				return: null,
				index: 0,
				effectTag: "update",
			};
		} else {
			// create
			newFiber = {
				type: child.type,
				props: child.props,
				child: null,
				parent: fiber,
				sibling: null,
				dom: null,
				return: null,
				index: 0,
				effectTag: "create",
			};
		}
		if (oldFiber) {
			oldFiber = oldFiber.sibling;
		}
		if (index === 0) {
			fiber.child = newFiber;
		} else {
			if (prevChild) {
				prevChild.sibling = newFiber;
			}
		}
		prevChild = newFiber;
	});
}

function findNextUnitOfWork(fiber: FiberNode): FiberNode | null {
	// 有子节点返回子节点
	if (fiber.child) {
		return fiber.child;
	}

	let currentFiber: FiberNode | null = fiber;
	// 没有子节点返回兄弟节点
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
	if (fiber.effectTag === "update") {
		updateProps(fiber);
	} else if (fiber.effectTag === "create") {
		const container = fiber.parent?.dom as HTMLElement;
		fiber.dom && container.append(fiber.dom);
	}
	fiber.child && commitRoot(fiber.child);
	fiber.sibling && commitRoot(fiber.sibling);
}

export function workLoop(deadline: IdleDeadline) {
	let shouldYield = false;

	while (!shouldYield && nextFiber) {
		const result = performUnitOfWork(nextFiber);
		nextFiber = result;
		shouldYield = deadline.timeRemaining() < 1;
	}
	if (!nextFiber && rootFiber) {
		// 遍历完成后统一提交
		rootFiber.child && commitRoot(rootFiber.child);
		currentRootFiber = rootFiber;
		rootFiber = null;
	}
	requestIdleCallback(workLoop);
}

export function update() {
	if (currentRootFiber) {
		setNextFiber({
			type: currentRootFiber.type,
			props: currentRootFiber.props,
			sibling: null,
			child: null,
			return: null,
			parent: null,
			index: 0,
			dom: currentRootFiber.dom,
			alternate: currentRootFiber,
		});
	}
	setRootFiber(nextFiber);
}
