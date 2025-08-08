import React from "react";
import FlightForm from "./components/FlightForm";

const App: React.FC = () => {
	return (
		<div className="app-container">
			<div className="main-card">
				<h1 className="app-title">Flight Calendar App</h1>
				<p className="app-subtitle">
					Import your flight details into Apple Calendar.
				</p>
				<FlightForm />
			</div>
		</div>
	);
};

export default App;
