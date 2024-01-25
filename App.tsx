import React from "./src/React";
import { useState, useEffect } from "./src/Scheduler";

function Foo() {
	const [count, setCount] = useState(0);
	const [anotherCount, setAnotherCount] = useState(1);

	useEffect(() => {
		console.log("empty Effect");
	}, []);
	useEffect(() => {
		console.log("countEffect");
	}, [count]);
	useEffect(() => {
		console.log("anotherCountEffect");
		return () => {
			console.log("anotherCountEffect 0");
		};
	}, [anotherCount]);

	useEffect(() => {
		console.log("anotherCountEffect");
		return () => {
			console.log("anotherCountEffect 1");
		};
	}, [anotherCount]);

	return (
		<div>
			<h1>Foo</h1>
			{count}
			<button
				onClick={() => {
					setCount(count + 1);
				}}
			>
				count click
			</button>
			{anotherCount}
			<button
				onClick={() => {
					setAnotherCount(anotherCount + 1);
				}}
			>
				another count click
			</button>
		</div>
	);
}
function App() {
	return <Foo />;
}
export default App;
