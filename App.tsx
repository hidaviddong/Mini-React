import React from "./src/React";
function App() {
	return (
		<div id="hey">
			<p>Hello World</p>
			<Layout num={10} />
			<Layout num={20} />
			<input />
		</div>
	);
}

function Layout({ num }) {
	return <p id={num}>the number is :{num}</p>;
}

export default App;
