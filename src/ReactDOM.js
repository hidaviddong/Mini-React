
export function createRoot(domNode) {
	return {
		render(reactNode) {
            const element = document.createElement(reactNode.type)
            element.innerText = reactNode.children
            element.classList.add(reactNode.props.className)
            domNode.appendChild(element)
		},
	};
}
