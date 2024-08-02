const express = require('express');
const { SerialPort } = require('serialport'); 
const { ReadlineParser } = require('@serialport/parser-readline'); // Use ReadlineParser
const cors = require('cors');

const app = express();
const port = 3000;

app.use(cors());

// Create a new instance of SerialPort
const serialPort = new SerialPort({
  path: 'COM3', 
  baudRate: 9600,
}, (err) => {
  if (err) {
    console.error('Error opening COM port:', err.message);
    process.exit(1);
  }
});

const parser = serialPort.pipe(new ReadlineParser({ delimiter: '\r\n' })); // Use ReadlineParser

let data = {};

parser.on('data', (line) => {
  console.log(`Received: ${line}`);
  const [bpm, spo2] = line.split(', ').map(s => s.split(': ')[1]);
  data = { bpm, spo2 };
});

app.get('/data', (req, res) => {
  res.json(data);
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
