import React from "./src/React";
import { update } from "./src/Scheduler";
let count = 0;
function App() {
	function handleClick() {
		count++;
		update();
	}
	// biome-ignore lint/a11y/useButtonType: <explanation>
	return <button onClick={handleClick}>{count}</button>;
}

function Layout({ num }) {
	return <p id={num}>the number is :{num}</p>;
}

export default App;
