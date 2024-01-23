import React from "./src/React";
import { update } from "./src/Scheduler";
let count = 0;
let showBar = false;
function App() {
	const foo = (
		<div>
			foo
			<div>child foo</div>
			<div>child 2 foo</div>
		</div>
	);
	const bar = <div>Bar</div>;
	function handleClick() {
		count++;
		update();
	}
	function handleShowBarClick() {
		showBar = !showBar;
		update();
	}
	return (
		<div>
			<button onClick={handleClick}>{count}</button>
			<button onClick={handleShowBarClick}>Showbar</button>
			<div>Hello World</div>
			{showBar ? foo : bar}
			<Foo num={1} />
		</div>
	);
}

function Foo({ num }) {
	return (
		<div>
			<p>This is the Child Component</p>
			<p>the value is :{num}</p>
		</div>
	);
}
export default App;
