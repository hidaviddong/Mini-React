import React from "./src/React";
import { useState } from "./src/Scheduler";

function Foo() {
	const [count, setCount] = useState(0);
	const handleButtonClick = () => {
		setCount((c) => c + 1);
	};
	return (
		<div>
			<h1>Foo</h1>
			{count}
			<button onClick={handleButtonClick}>click</button>
		</div>
	);
}
function App() {
	return <Foo />;
}
export default App;
