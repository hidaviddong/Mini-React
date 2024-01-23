import React from "./src/React";
import { update } from "./src/Scheduler";

let fooCount = 0;
let barCount = 0;
function Foo() {
	const handleButtonClick = () => {
		fooCount++;
		update();
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
	const handleButtonClick = () => {
		barCount++;
		update();
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
