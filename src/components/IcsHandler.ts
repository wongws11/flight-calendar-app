interface ICSEvent {
	start: Date;
	end: Date;
	startTz: string; // e.g., "America/New_York"
	endTz: string; // e.g., "America/New_York"
	title: string;
}

/**
 * Formats a Date object to ICS format (YYYYMMDDTHHMMSSZ)
 */
function formatICSDate(date: Date): string {
	const pad = (n: number): string => String(n).padStart(2, "0");
	const year = date.getUTCFullYear();
	const month = pad(date.getUTCMonth() + 1);
	const day = pad(date.getUTCDate());
	const hours = pad(date.getUTCHours());
	const minutes = pad(date.getUTCMinutes());
	const seconds = pad(date.getUTCSeconds());

	return `${year}${month}${day}T${hours}${minutes}${seconds}Z`;
}

/**
 * Sanitizes event title for ICS format by removing special characters
 */
function sanitizeEventTitle(title: string): string {
	return title.replace(/[\n\r]/g, " ").substring(0, 255);
}

/**
 * Creates and downloads an ICS calendar file
 */
function createICSFile(event: ICSEvent): void {
	const uid = `flight-${Date.now()}@flight-calendar-app.local`;
	const dtstamp = formatICSDate(new Date());
	const dtstart = formatICSDate(event.start);
	const dtend = formatICSDate(event.end);
	const summary = sanitizeEventTitle(event.title);

	// Create VTIMEZONE components for each timezone
	const timezoneComponents = Array.from(new Set([event.startTz, event.endTz]))
		.map((tz) => createVTIMEZONE(tz))
		.join("\n");

	const icsContent = [
		"BEGIN:VCALENDAR",
		"VERSION:2.0",
		"PRODID:-//Flight Calendar App//EN",
		"CALSCALE:GREGORIAN",
		"METHOD:PUBLISH",
		timezoneComponents,
		"BEGIN:VEVENT",
		`UID:${uid}`,
		`DTSTAMP:${dtstamp}`,
		`DTSTART:${dtstart}`,
		`DTEND:${dtend}`,
		`SUMMARY:${summary}`,
		"STATUS:CONFIRMED",
		"END:VEVENT",
		"END:VCALENDAR",
	].join("\r\n");

	downloadICSFile(icsContent, summary);
}

/**
 * Creates a basic VTIMEZONE component for the given timezone
 * Note: This is simplified; production code should use IANA timezone data
 */
function createVTIMEZONE(tzId: string): string {
	return `BEGIN:VTIMEZONE
TZID:${tzId}
BEGIN:STANDARD
DTSTART:19700101T000000
TZOFFSETFROM:+0000
TZOFFSETTO:+0000
END:STANDARD
END:VTIMEZONE`;
}

/**
 * Triggers download of the ICS file
 */
function downloadICSFile(content: string, filename: string): void {
	try {
		const blob = new Blob([content], {
			type: "text/calendar;charset=utf-8",
		});
		const link = document.createElement("a");
		link.href = URL.createObjectURL(blob);
		link.download = `${filename.replace(/\s+/g, "_")}.ics`;
		document.body.appendChild(link);
		link.click();
		document.body.removeChild(link);
		URL.revokeObjectURL(link.href);
	} catch (error) {
		throw new Error(
			`Failed to download ICS file: ${error instanceof Error ? error.message : "Unknown error"}`
		);
	}
}

export { type ICSEvent, createICSFile };
