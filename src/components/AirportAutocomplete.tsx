import React, { useState } from "react";
import { Autocomplete, TextField } from "@mui/material";
import { Airport, airports } from "../data/airports";

type AirportAutocompleteProps = {
	label: string;
	onChange: (value: Airport | null) => void;
};

const AirportAutocomplete: React.FC<AirportAutocompleteProps> = ({
	label,
	onChange,
}) => {
	const [options, setOptions] = useState<Airport[]>([]);

	const filterAirports = (input: string) => {
		if (input.length < 3) {
			setOptions([]);
			return;
		}

		const filteredAirports = airports.reduce<Airport[]>((acc, cur) => {
			if (cur.iata === input.toUpperCase()) {
				return [...acc, cur];
			}
			if (cur.name.toLowerCase().includes(input.toLowerCase())) {
				return [...acc, cur];
			}
			return acc;
		}, []);
		setOptions(filteredAirports);
	};

	return (
		<Autocomplete
			options={options}
			getOptionLabel={(option) => `${option.iata} - ${option.name}`}
			onChange={(_e, value) => onChange(value || null)}
			renderInput={(params) => (
				<TextField {...params} label={label} variant="outlined" />
			)}
			onInputChange={(_e, value) => {
				filterAirports(value);
			}}
		/>
	);
};

export default AirportAutocomplete;
