import React from "./src/React";
import { update } from "./src/Scheduler";

let fooCount = 0;
let barCount = 0;
function Foo() {
	console.log("Foo update");
	const _update = update();
	const handleButtonClick = () => {
		fooCount++;
		_update();
	};
	return (
		<div>
			Foo
			{fooCount}
			<button onClick={handleButtonClick}>click</button>
		</div>
	);
}
function Bar() {
	console.log("Bar update");
	const _update = update();
	const handleButtonClick = () => {
		barCount++;
		_update();
	};
	return (
		<div>
			Bar
			{barCount}
			<button onClick={handleButtonClick}>click</button>
		</div>
	);
}
function App() {
	return (
		<div>
			<Foo />
			<Bar />
		</div>
	);
}
export default App;
