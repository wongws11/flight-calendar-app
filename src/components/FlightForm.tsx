import React, { useState, useMemo, useCallback } from "react";
import { TextField, Button, Stack, Alert, Box } from "@mui/material";
import SwapVertIcon from "@mui/icons-material/SwapVert";
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

const DEFAULT_DEPARTURE_TIME = dayjs().format().slice(0, 16);
const DEFAULT_ARRIVAL_TIME = dayjs().add(1, "hour").format().slice(0, 16);

const FlightForm: React.FC = () => {
	const [departureAirport, setDepartureAirport] = useState<Airport | null>(
		null
	);
	const [arrivalAirport, setArrivalAirport] = useState<Airport | null>(null);
	const [departureTime, setDepartureTime] = useState<string>(
		DEFAULT_DEPARTURE_TIME
	);
	const [arrivalTime, setArrivalTime] = useState<string>(
		DEFAULT_ARRIVAL_TIME
	);
	const [flightNumber, setFlightNumber] = useState<string>("");
	const [error, setError] = useState<string>("");

	const isFormValid = useMemo(
		() =>
			departureAirport &&
			arrivalAirport &&
			departureTime &&
			arrivalTime &&
			dayjs(departureTime).isBefore(dayjs(arrivalTime)),
		[departureAirport, arrivalAirport, departureTime, arrivalTime]
	);

	const handleGenerateICS = useCallback(() => {
		setError("");

		if (!isFormValid) {
			setError("Please fill in all fields and ensure departure is before arrival");
			return;
		}

		try {
			const eventTitle = flightNumber
				? `Flight ${flightNumber} from ${departureAirport!.iata} to ${arrivalAirport!.iata}`
				: `Flight from ${departureAirport!.iata} to ${arrivalAirport!.iata}`;

			const icsEvent: ICSEvent = {
				start: dayjs.tz(departureTime, departureAirport!.tz).toDate(),
				end: dayjs.tz(arrivalTime, arrivalAirport!.tz).toDate(),
				startTz: departureAirport!.tz,
				endTz: arrivalAirport!.tz,
				title: eventTitle,
			};

			createICSFile(icsEvent);
			setError("");
		} catch (err) {
			setError(`Failed to generate ICS file: ${err instanceof Error ? err.message : "Unknown error"}`);
		}
	}, [isFormValid, flightNumber, departureAirport, arrivalAirport, departureTime, arrivalTime]);

	const handleSwapAirports = useCallback(() => {
		const temp = departureAirport;
		setDepartureAirport(arrivalAirport);
		setArrivalAirport(temp);
	}, [departureAirport, arrivalAirport]);

	return (
		<Stack spacing={3}>
			{error && <Alert severity="error">{error}</Alert>}
			<AirportAutocomplete
				label="Departure Airport"
				value={departureAirport}
				onChange={setDepartureAirport}
			/>
			<TextField
				label="Departure Time"
				type="datetime-local"
				InputLabelProps={{ shrink: true }}
				value={departureTime}
				onChange={(e) => setDepartureTime(e.target.value)}
				fullWidth
			/>
			<Box display="flex" justifyContent="center">
				<Button
					variant="outlined"
					size="small"
					onClick={handleSwapAirports}
					disabled={!departureAirport || !arrivalAirport}
					startIcon={<SwapVertIcon />}
					sx={{ textTransform: "none" }}
				>
					Swap Airports
				</Button>
			</Box>
			<AirportAutocomplete
				label="Arrival Airport"
				value={arrivalAirport}
				onChange={setArrivalAirport}
			/>
			<TextField
				label="Arrival Time"
				type="datetime-local"
				InputLabelProps={{ shrink: true }}
				value={arrivalTime}
				onChange={(e) => setArrivalTime(e.target.value)}
				fullWidth
			/>
			<TextField
				label="Flight Number (optional)"
				type="text"
				value={flightNumber}
				onChange={(e) => setFlightNumber(e.target.value)}
				fullWidth
			/>
			<Button
				variant="contained"
				color="primary"
				disabled={!isFormValid}
				onClick={handleGenerateICS}
				size="large"
				sx={{
					mt: 2,
					py: 1.5,
					borderRadius: 2,
					textTransform: "none",
					fontSize: "1.1rem",
					fontWeight: 600,
				}}
			>
				Generate ICS File
			</Button>
		</Stack>
	);
};

export default FlightForm;
