import React, { useState } from "react";
import { TextField, Button, Stack } from "@mui/material";
import dayjs from "dayjs";
import toArray from "dayjs/plugin/toArray";
import AirportAutocomplete from "./AirportAutocomplete";
import { saveAs } from "file-saver";
import { createEvent } from "ics";

dayjs.extend(toArray);

const FlightForm: React.FC = () => {
	const [departureAirport, setDepartureAirport] = useState<string | null>(null);
	const [arrivalAirport, setArrivalAirport] = useState<string | null>(null);
	const [departureTime, setDepartureTime] = useState<string>("");
	const [arrivalTime, setArrivalTime] = useState<string>("");

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

		const event = {
			start: dayjs(departureTime).toArray().slice(0, 5) as [
				number,
				number,
				number,
				number,
				number
			],
			end: dayjs(arrivalTime).toArray().slice(0, 5) as [
				number,
				number,
				number,
				number,
				number
			],
			title: `Flight from ${departureAirport} to ${arrivalAirport}`,
			description: `Flight details:\nDeparture: ${departureAirport}\nArrival: ${arrivalAirport}`,
			location: `From ${departureAirport} to ${arrivalAirport}`,
		};

		createEvent(event, (error, value) => {
			if (error) {
				console.error(error);
				alert("Failed to create ICS file.");
				return;
			}

			const blob = new Blob([value || ""], {
				type: "text/calendar;charset=utf-8",
			});
			saveAs(blob, "flight-details.ics");
		});
	};

	return (
		<Stack spacing={2} width="400px" margin="auto" mt={5}>
			<AirportAutocomplete
				label="Departure Airport"
				onChange={setDepartureAirport}
			/>
			<TextField
				label="Departure Time"
				type="datetime-local"
				InputLabelProps={{ shrink: true }}
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
				onChange={(e) => setArrivalTime(e.target.value)}
			/>
			<Button variant="contained" color="primary" onClick={handleGenerateICS}>
				Generate ICS File
			</Button>
		</Stack>
	);
};

export default FlightForm;
