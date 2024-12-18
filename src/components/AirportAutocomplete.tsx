import React from "react";
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
	return (
		<Autocomplete
			options={airports}
			getOptionLabel={(option) => `${option.iata} - ${option.name}`}
			onChange={(_event, value) => onChange(value || null)}
			renderInput={(params) => (
				<TextField {...params} label={label} variant="outlined" />
			)}
		/>
	);
};

export default AirportAutocomplete;
