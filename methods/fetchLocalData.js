var fs = require('fs').promises;
var parse = require('csv-parse/lib/sync');

async function fetchCsvSource() {
	const fileContent = await fs.readFile(__dirname+'/views/test.csv');
	const records = parse(fileContent);
	return records;
}

module.exports = async  function () {
	try {
		console.log('start fetching...');
		const response = await fetchCsvSource();
		const rows = response.splice(1);

		console.log('the rows', rows);

		rows.forEach((row, idx) => {
			const country = row[0];
			const dataDate = [row[1]];
			
			if(countries[countries.length - 1] !== country) {
				globalData[country] = { labels: [], data: [], dataObj: {} };
				countries.push(country);
			}

			globalData[country].labels.push(moment(new Date (dataDate)).format('MMM DD YYYY'));
			globalData[country].data.push(Math.round(parseFloat(row[2])  * 100) / 100 );
			
		});

		console.log('done fetching!');

		currentlyFetching = false;
		serveCountries = countries;
	} catch(err) {
		console.log(err);
	}
}