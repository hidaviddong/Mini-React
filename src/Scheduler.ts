import {
	FiberNode,
	REACT_ELEMENT,
	FiberNodeFunctionType,
	StateHook,
} from "../types";
import type { ReactElement } from "../types";
let nextWorkOfUnit: FiberNode | null;
let wipRoot: FiberNode | null;
let wipFiber: FiberNode | null;
let currentRoot: FiberNode | null;
let oldFiberArray: Array<FiberNode>;
let stateHooks: Array<StateHook> = [];
let stateHookIndex: number;
function workLoop(deadline: IdleDeadline) {
	let shouldYield = false;

	while (!shouldYield && nextWorkOfUnit) {
		nextWorkOfUnit = performUnitOfWork(nextWorkOfUnit) as FiberNode;
		if (wipRoot?.sibling?.type === nextWorkOfUnit?.type) {
			nextWorkOfUnit = null;
		}
		shouldYield = deadline.timeRemaining() < 1;
	}
	if (!nextWorkOfUnit && wipRoot) {
		commitRoot();
	}
	requestIdleCallback(workLoop);
}

function commitRoot() {
	typeof oldFiberArray === "object" && oldFiberArray.forEach(commitDelete);
	wipRoot?.child && commitWork(wipRoot.child);

	currentRoot = wipRoot;

	wipRoot = null;
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
		const isSameType = oldFiber && oldFiber.type === child.type;
		let newFiber: FiberNode | null;
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
			// 如果child 为 boolean 就不创建值
			if (child) {
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
			} else {
				newFiber = null;
			}
			if (oldFiber) {
				oldFiberArray.push(oldFiber);
			}
		}
		if (oldFiber) {
			oldFiber = oldFiber.sibling;
		}

		if (newFiber) {
			if (index === 0) {
				fiber.child = newFiber;
			} else {
				prevChild.sibling = newFiber;
			}
			prevChild = newFiber;
		}
	});
	// 删除嵌套节点的情况
	while (oldFiber) {
		oldFiberArray.push(oldFiber);
		oldFiber = oldFiber.sibling;
	}
}

function updateFunctionComponent(fiber: FiberNode) {
	stateHooks = [];
	stateHookIndex = 0;
	wipFiber = fiber;
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

	wipRoot = nextWorkOfUnit;
}

export function update() {
	const currentFiber = wipFiber;
	return () => {
		// 闭包
		wipRoot = {
			...(currentFiber as FiberNode),
			alternate: currentFiber,
		};
		nextWorkOfUnit = wipRoot;
	};
}

export function useState(initValue: any) {
	let oldHook: StateHook | null = null;
	const currentFiber = wipFiber;
	if (currentFiber?.alternate?.stateHooks) {
		oldHook = currentFiber.alternate.stateHooks[stateHookIndex];
	}
	const stateHook: StateHook = {
		state: oldHook ? oldHook.state : initValue,
		queue: oldHook ? oldHook.queue : [],
	};

	stateHook.queue.forEach((action) => {
		stateHook.state = action(stateHook.state);
	});
	stateHookIndex++;
	stateHooks.push(stateHook);
	stateHook.queue = [];

	if (currentFiber) {
		currentFiber.stateHooks = stateHooks;
	}
	function setState(action) {
		stateHook.queue.push(action);
		// 更新逻辑
		wipRoot = {
			...(currentFiber as FiberNode),
			alternate: currentFiber,
		};
		nextWorkOfUnit = wipRoot;
	}
	return [stateHook.state, setState];
}

requestIdleCallback(workLoop);
