import React from "react";
import { Autocomplete, TextField } from "@mui/material";

const airports = [
	{ code: "JFK", name: "John F. Kennedy International Airport" },
	{ code: "LAX", name: "Los Angeles International Airport" },
	{ code: "ORD", name: "O'Hare International Airport" },
	{ code: "ATL", name: "Hartsfield–Jackson Atlanta International Airport" },
	// Add more airports as needed
];

type AirportAutocompleteProps = {
	label: string;
	onChange: (value: string | null) => void;
};

const AirportAutocomplete: React.FC<AirportAutocompleteProps> = ({
	label,
	onChange,
}) => {
	return (
		<Autocomplete
			options={airports}
			getOptionLabel={(option) => `${option.code} - ${option.name}`}
			onChange={(_event, value) => onChange(value ? value.code : null)}
			renderInput={(params) => (
				<TextField {...params} label={label} variant="outlined" />
			)}
		/>
	);
};

export default AirportAutocomplete;
