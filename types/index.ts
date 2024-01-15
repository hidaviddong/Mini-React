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
