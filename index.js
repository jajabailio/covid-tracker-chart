
const express = require('express');
const app = express();
const _ = require('lodash');
const CronJob = require('cron').CronJob;
const compression = require('compression');
const cors = require('cors');

app.set('view engine', 'ejs');

app.use(express.json());
app.use(express.static('views'));
app.use('/scripts', express.static(__dirname + '/node_modules/chartjs-plugin-zoom/dist/'));
app.use(compression());
app.use(cors());


// GLOBAL VARIABLES
let countries = [];
let serveCountries = [];
let globalData = {};
let currentlyFetching = false;

const localCSVData = require('./methods/fetchLocalData');		// use this method to test fetching csv locally
const parseCsvData = require('./methods/parseData');			// parse csv from url

app.get('/', (req, res) => {
	res.render('pages/index', {
		countries: serveCountries
	});
});

app.get('/chart/:country', async (req, res) => {
	const country = req.params.country;

	res.render('pages/chart', {
		chartData: globalData[country],
		country,
		countries: serveCountries
	})
});


app.get('/see/test', (req, res) => {
	res.send(globalData);
})
// this route is to see the globalData (parsed data)

const job = new CronJob('0 0 0 * * *', function() {
  // run every midnight
  parseCsvData();
});

job.start();
parseCsvData()
	.then(result => {
		countries = result.countries;
		globalData = result.globalData;
		serveCountries = countries;
	});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));