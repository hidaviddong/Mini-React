import type { ReactElement } from "../types";
import { render } from "./Scheduler";

export function createRoot(domNode: HTMLElement) {
	return {
		render(reactNode: ReactElement) {
			return render(reactNode, domNode);
		},
	};
}
