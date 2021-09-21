let countries = [];
let globalData = {};

const moment = require('moment');
const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));

let displayOnce = true;

module.exports = async function () {
	try {
		
		console.log('currently fetching...');
		
		const testLink = "https://raw.githubusercontent.com/crondonm/TrackingR/main/Estimates-Database/database.csv";
		const response = await fetch(testLink);
		const responseText = await response.text();
	
		const rows = responseText.split("\n").slice(1);

		rows.forEach((el, idx) => {
			let row = el.split(',');
			const country = row[0];
			const dataDate = [row[1]];
			
			if(countries[countries.length - 1] !== country && !countries.includes(country)) {
				globalData[country] = { labels: [], data: [], dataObj: {} };
				countries.push(country);

				globalData[country].labels.push(moment(new Date (dataDate)).format('MMM DD YYYY'));
				globalData[country].data.push(Math.round(parseFloat(row[2])  * 100) / 100 );
				globalData[country].dataObj[dataDate] = row[2];
			} else if(countries[countries.length - 1] !== country && countries.includes(country)) {
				// do nothing
				// this is to ignore the second instance of the same country in the csv
			} else {
				globalData[country].labels.push(moment(new Date (dataDate)).format('MMM DD YYYY'));
				globalData[country].data.push(Math.round(parseFloat(row[2])  * 100) / 100 );
				globalData[country].dataObj[dataDate] = row[2];
			}
			
		});

		console.log('done fetching!' );

		return { countries, globalData, }

	} catch(err) {
		console.log(err);
		return null;
	}
}