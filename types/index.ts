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

type FiberNodeFunctionType = (...args) => FiberNode;
export interface FiberNode {
	type: FiberNodeFunctionType | string;
	props: ReactElementProps;
	alternate?: FiberNode | null;
	child: FiberNode | null;
	sibling: FiberNode | null;
	return: FiberNode | null;
	parent: FiberNode | null;
	index: number;
	dom: HTMLElement | Text | null;
	effectTag?: string;
}
