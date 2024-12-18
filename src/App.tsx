import React from "react";
import FlightForm from "./components/FlightForm";

const App: React.FC = () => {
	return (
		<div>
			<h1 style={{ textAlign: "center" }}>Flight Calendar App</h1>
			<FlightForm />
		</div>
	);
};

export default App;
