export interface ReactElementProps {
	children?: any;
	id?: string;
	className?: string;
	nodeValue?: string;
}
export interface ReactElement {
	type: string;
	props: ReactElementProps;
}
export type ReactElementChildren = ReactElement | string;

export enum REACT_ELEMENT {
	TEXT_ELEMENT = "TEXT_ELEMENT",
}

export type FiberNodeFunctionType = (...args) => FiberNode;
export type StateHook = {
	state: any;
	queue: Array<any>;
};
export type EffectHook = {
	callback: any;
	depends: Array<any>;
	cleanup: any;
};
export interface FiberNode {
	type?: FiberNodeFunctionType | string;
	props: ReactElementProps;
	alternate?: FiberNode | null;
	child?: FiberNode | null;
	sibling?: FiberNode | null;
	return?: FiberNode;
	parent?: FiberNode | null;
	index?: number;
	dom: HTMLElement | Text | null;
	effectTag?: string;
	stateHooks?: StateHook[];
	effectHooks?: EffectHook[];
}
