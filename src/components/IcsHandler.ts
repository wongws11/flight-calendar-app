interface ICSEvent {
	start: Date;
	end: Date;
	startTz: string; // e.g., "America/New_York"
	endTz: string; // e.g., "America/New_York"
	title: string;
}

function createICSFile(event: ICSEvent): void {
	const formatDate = (date: Date): string => {
		return date.toISOString().replace(/[-:]/g, "").split(".")[0] + "Z"; // UTC format with 'Z'
	};

	const uid = `${Date.now()}@example.com`;
	const dtstamp = formatDate(new Date());
	const dtstart = formatDate(event.start);
	const dtend = formatDate(event.end);

	const icsContent = `
BEGIN:VCALENDAR
VERSION:2.0
PRODID:-//YourCompany//YourProduct//EN
CALSCALE:GREGORIAN
BEGIN:VEVENT
UID:${uid}
DTSTAMP:${dtstamp}
DTSTART;TZID=${event.startTz}:${dtstart}
DTEND;TZID=${event.endTz}:${dtend}
SUMMARY:${event.title}
END:VEVENT
END:VCALENDAR
`.trim();

	const blob = new Blob([icsContent], { type: "text/calendar;charset=utf-8" });
	const link = document.createElement("a");
	link.href = URL.createObjectURL(blob);
	link.download = `${event.title.replace(/\s+/g, "_")}.ics`;
	document.body.appendChild(link);
	link.click();
	document.body.removeChild(link);
}

export { type ICSEvent, createICSFile };
