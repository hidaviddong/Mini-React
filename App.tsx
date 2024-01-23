import React from "./src/React";
import { update } from "./src/Scheduler";
let count = 0;
let showBar = false;
function App() {
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
			<div>{showBar ? bar : <Foo num={13} />}</div>
			<Foo num={12} />
			<Foo num={14} />
		</div>
	);
}

function Foo({ num }) {
	return <div>This is the Child Component,the value is :{num}</div>;
}
export default App;
