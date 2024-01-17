import React from "./src/React";
function App() {
	function handleClick() {
		console.log("click");
	}
	return (
		<div id="hey">
			<p>Hello World</p>
			<Layout num={10} />
			<Layout num={20} />
			<input />
			{/* biome-ignore lint/a11y/useButtonType: <explanation> */}
			<button onClick={handleClick}>click me </button>
		</div>
	);
}

function Layout({ num }) {
	return <p id={num}>the number is :{num}</p>;
}

export default App;
