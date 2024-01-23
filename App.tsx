import React from "./src/React";
import { update } from "./src/Scheduler";
let showBar = false;
function Foo() {
	const bar = <div>bar</div>;
	function handleShowBar() {
		showBar = !showBar;
		update();
	}
	return (
		<div>
			Foo
			{showBar && bar}
			<button onClick={handleShowBar}>showBar</button>
		</div>
	);
}
function App() {
	return (
		<div>
			Hi
			<Foo />
		</div>
	);
}
export default App;
