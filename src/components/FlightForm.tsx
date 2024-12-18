import React, { useState } from "react";
import { TextField, Button, Stack } from "@mui/material";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";
import toArray from "dayjs/plugin/toArray";
import AirportAutocomplete from "./AirportAutocomplete";
import { saveAs } from "file-saver";
import { createEvent } from "ics";
import { Airport } from "../data/airports";

dayjs.extend(toArray);
dayjs.extend(utc);
dayjs.extend(timezone);

/**
 * From a datetime string, return an array of numbers to create an ics file.
 * Utilize the dayjs to handle all timezones and export in UTC time.
 * @param datetime e.g. 2024-12-17T18:48
 * @param tz e.g. America/New_York
 */
const dateToEvent = (
	datetime: string,
	tz: string
): [number, number, number, number, number] => {
	const date = dayjs.tz(datetime, tz).utc();
	const dateArray = date.toArray().slice(0, 5);
	// Fucking javascript, month is 0-indexed
	dateArray[1] += 1;
	return dateArray as [number, number, number, number, number];
};

const FlightForm: React.FC = () => {
	const [departureAirport, setDepartureAirport] = useState<Airport | null>(
		null
	);
	const [arrivalAirport, setArrivalAirport] = useState<Airport | null>(null);
	const [departureTime, setDepartureTime] = useState<string>("");
	const [arrivalTime, setArrivalTime] = useState<string>("");

	const handleGenerateICS = () => {
		console.log(departureAirport, arrivalAirport, departureTime, arrivalTime);
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
			start: dateToEvent(departureTime, departureAirport.tz),
			end: dateToEvent(arrivalTime, arrivalAirport.tz),
			title: `Flight from ${departureAirport.name} to ${arrivalAirport.name}`,
			description: `Flight details:\nDeparture: ${departureAirport.name}\nArrival: ${arrivalAirport.name}`,
			location: `From ${departureAirport.name} to ${arrivalAirport.name}`,
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
