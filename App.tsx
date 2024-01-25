import React from "./src/React";
import { useState } from "./src/Scheduler";

function Foo() {
	const [count, setCount] = useState(0);
	const [anotherCount, setAnotherCount] = useState(1);
	const handleButtonClick = () => {
		setCount(count + 1);
		setAnotherCount(anotherCount + 1);
	};
	return (
		<div>
			<h1>Foo</h1>
			{count}
			{anotherCount}
			<button onClick={handleButtonClick}>click</button>
		</div>
	);
}
function App() {
	return <Foo />;
}
export default App;
