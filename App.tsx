import React from "./src/React";
function App() {
	return (
		<div id="hey">
			Hello
			<p>World</p>
			<h1>Hi</h1>
			<input />
			<Layout />
		</div>
	);
}

function Foo() {
	return <div>Foo</div>;
}
function Layout() {
	return (
		<div>
			<Foo />
		</div>
	);
}

export default App;
