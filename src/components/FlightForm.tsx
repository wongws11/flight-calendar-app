import React, { useState } from "react";
import { TextField, Button, Stack } from "@mui/material";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";
import toArray from "dayjs/plugin/toArray";
import AirportAutocomplete from "./AirportAutocomplete";
import { Airport } from "../data/airports";
import { createICSFile, type ICSEvent } from "./IcsHandler";

dayjs.extend(toArray);
dayjs.extend(utc);
dayjs.extend(timezone);

const FlightForm: React.FC = () => {
	const [departureAirport, setDepartureAirport] = useState<Airport | null>(
		null
	);
	const [arrivalAirport, setArrivalAirport] = useState<Airport | null>(null);
	const [departureTime, setDepartureTime] = useState<string>(
		dayjs().format().slice(0, 16)
	);
	const [arrivalTime, setArrivalTime] = useState<string>(
		dayjs().add(1, "hour").format().slice(0, 16)
	);
	const [flightNumber, setFlightNumber] = useState<string>("");

	const handleGenerateICS = () => {
		if (
			!departureAirport ||
			!arrivalAirport ||
			!departureTime ||
			!arrivalTime
		) {
			alert("Please fill in all fields");
			return;
		}

		const eventTitle = flightNumber
			? `Flight ${flightNumber} from ${departureAirport.name} to ${arrivalAirport.name}`
			: `Flight from ${departureAirport.name} to ${arrivalAirport.name}`;

		const icsEvent: ICSEvent = {
			start: dayjs.tz(departureTime, "UTC").toDate(),
			end: dayjs.tz(arrivalTime, "UTC").toDate(),
			startTz: departureAirport.tz,
			endTz: arrivalAirport.tz,
			title: eventTitle,
		};

		createICSFile(icsEvent);
	};

	const allInputsReady =
		departureAirport && arrivalAirport && departureTime && arrivalTime;

	return (
		<Stack spacing={2} paddingX={1} maxWidth="400px" margin="auto" mt={5}>
			<AirportAutocomplete
				label="Departure Airport"
				onChange={setDepartureAirport}
			/>
			<TextField
				label="Departure Time"
				type="datetime-local"
				InputLabelProps={{ shrink: true }}
				defaultValue={dayjs().format().slice(0, 16)}
				onChange={(e) => setDepartureTime(e.target.value)}
			/>
			<AirportAutocomplete
				label="Arrival Airport"
				onChange={setArrivalAirport}
			/>
			<TextField
				label="Arrival Time"
				type="datetime-local"
				InputLabelProps={{ shrink: true }}
				defaultValue={dayjs().add(1, "hour").format().slice(0, 16)}
				onChange={(e) => setArrivalTime(e.target.value)}
			/>
			<TextField
				label="Flight Number (optional)"
				type="text"
				value={flightNumber}
				onChange={(e) => setFlightNumber(e.target.value)}
			/>
			<Button
				variant="contained"
				color="primary"
				disabled={!allInputsReady}
				onClick={handleGenerateICS}
			>
				Generate ICS
			</Button>
		</Stack>
	);
};

export default FlightForm;
