import React from "react";
import FlightForm from "./components/FlightForm";

const App: React.FC = () => {
	return (
		<div>
			<h1 style={{ textAlign: "center" }}>Flight Calendar App</h1>
			<p style={{ textAlign: "center" }}>
				Import your flight details into Apple Calendar.
			</p>
			<FlightForm />
		</div>
	);
};

export default App;
