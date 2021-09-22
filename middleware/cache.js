const redis = require('redis');

const REDIS_PORT = process.env.REDIS_PORT || 6379;
const client = redis.createClient(REDIS_PORT);

module.exports = function (req, res, next) {
	const country = req.params.country;

	client.get(country, (err, data) => {
		if(err) throw err;

		if(data !== null) {
			res.render('pages/chart', {
				chartData: JSON.parse(data),
				country,
			})
		} else {
			next();
		}
	});
}