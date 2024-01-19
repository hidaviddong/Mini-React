import React from "./src/React";
import { update } from "./src/Scheduler";
let count = 0;
function App() {
	function handleClick() {
		count++;
		update();
	}
	return (
		<div>
			<p onClick={handleClick}>{count}</p>
			<div>Hello World</div>
			<Foo num={12} />
			<Foo num={14} />
		</div>
	);
}

function Foo({ num }) {
	return <div>This is the Child Component,the value is :{num}</div>;
}
export default App;
