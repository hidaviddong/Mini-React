import React from "./src/React";
function App() {
	return (
		<div id="hey">
			<Layout num={10} />
			<Layout num={20} />
		</div>
	);
}

function Layout({ num }) {
	return <p>the number is :{num}</p>;
}

export default App;
