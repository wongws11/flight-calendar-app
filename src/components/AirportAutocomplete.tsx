import React, { useState, useMemo, useCallback } from "react";
import { Autocomplete, TextField } from "@mui/material";
import { Airport, airports } from "../data/airports";

type AirportAutocompleteProps = {
	label: string;
	value: Airport | null;
	onChange: (value: Airport | null) => void;
};

const AirportAutocomplete: React.FC<AirportAutocompleteProps> = ({
	label,
	value,
	onChange,
}) => {
	const [inputValue, setInputValue] = useState<string>("");

	const filterAirports = useCallback((input: string): Airport[] => {
		if (input.length < 2) {
			return [];
		}

		const upperInput = input.toUpperCase();
		const lowerInput = input.toLowerCase();

		return airports.filter(
			(airport) =>
				airport.iata === upperInput ||
				airport.name.toLowerCase().includes(lowerInput)
		);
	}, []);

	const filteredOptions = useMemo(
		() => filterAirports(inputValue),
		[inputValue, filterAirports]
	);

	return (
		<Autocomplete
			options={filteredOptions}
			getOptionLabel={(option) => `${option.iata} - ${option.name}`}
			value={value}
			onChange={(_e, selectedValue) => onChange(selectedValue || null)}
			inputValue={inputValue}
			onInputChange={(_e, newInputValue) => {
				setInputValue(newInputValue);
			}}
			renderInput={(params) => (
				<TextField {...params} label={label} variant="outlined" />
			)}
			noOptionsText="Type at least 2 characters to search"
		/>
	);
};

export default AirportAutocomplete;
