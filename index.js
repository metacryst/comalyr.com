const express = require('express');
const path = require('path');
const fs = require('fs');
const bodyParser = require('body-parser');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware to parse form data
app.use(bodyParser.urlencoded({ extended: true }));

// Serve static files
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static(__dirname));

// Serve HTML pages
app.get('/', (req, res) => {
  	res.sendFile(path.join(__dirname, 'src', 'pages', 'index.html'));
});

app.get('/:page', (req, res) => {
	const filePath = path.join(__dirname, 'src', 'pages', `${req.params.page}.html`);
	res.sendFile(filePath, (err) => {
		if (err) {
		res.status(404).sendFile(path.join(__dirname, 'src', 'pages', '404.html'));
		}
	});
});

// Helper function to append to CSV
function appendToCSV(filePath, rowArray) {
	const row = rowArray.map(item => `"${item.replace(/"/g, '""')}"`).join(',') + '\n';
	fs.appendFile(filePath, row, (err) => {
		if (err) console.error(`Error writing to ${filePath}:`, err);
	});
}

function makeDate() {
	const isoString = "2025-10-29T02:04:54.444Z";

	// Create a Date object
	const date = new Date(isoString);

	// Convert to Central Time (US Central)
	const options = {
	timeZone: 'America/Chicago',
	month: '2-digit',
	day: '2-digit',
	hour: 'numeric',
	minute: '2-digit',
	hour12: true
	};

	const formatter = new Intl.DateTimeFormat('en-US', options);
	const parts = formatter.formatToParts(date);

	// Extract parts
	let month = parts.find(p => p.type === 'month').value;
	let day = parts.find(p => p.type === 'day').value;
	let hour = parts.find(p => p.type === 'hour').value;
	let minute = parts.find(p => p.type === 'minute').value;
	let dayPeriod = parts.find(p => p.type === 'dayPeriod').value;

	// Format like MM.DD-H:MMam/pm
	const formatted = `${month}.${day}-${hour}:${minute}${dayPeriod.toLowerCase()}`;

	return formatted
}

// POST endpoint for Contact form
app.post('/contact', (req, res) => {
	const { fname, lname, email, phone, message } = req.body;
	const csvPath = path.join(__dirname, 'db', 'contact.csv');

	// Ensure db folder exists
	if (!fs.existsSync(path.join(__dirname, 'db'))) fs.mkdirSync(path.join(__dirname, 'db'));

	appendToCSV(csvPath, [makeDate(), email, `${fname} ${lname}`, phone, message]);
	res.send('<p>Thank you for contacting us! <a href="/">Go back</a></p>');
});

// POST endpoint for Join form
app.post('/join', (req, res) => {
	const { fname, lname, email, phone } = req.body;
	const csvPath = path.join(__dirname, 'db', 'join.csv');

	// Ensure db folder exists
	if (!fs.existsSync(path.join(__dirname, 'db'))) fs.mkdirSync(path.join(__dirname, 'db'));

	appendToCSV(csvPath, [makeDate(), email, `${fname} ${lname}`, phone]);
	res.send('<p>Thank you for joining! <a href="/">Go back</a></p>');
});

// Start server
app.listen(PORT, () => {
  	console.log(`🚀 Server running at http://localhost:${PORT}`);
});
