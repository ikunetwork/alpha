var CronJob = require('cron').CronJob;
const deployCrowdsale = require('./jobs/deploy-crowdsale');
const finalizeCrowdsale = require('./jobs/finalize-crowdsale');

var finalizeCrowdsaleJob = new CronJob({
	cronTime: '15,45 * * * * *', // every 15 seconds
	onTick: _ => {
		try {
			finalizeCrowdsale.run();
		} catch (e) {
			console.log('finalizeCrowdsale::run threw an exception', e);
		}
	},
	start: true,
	timeZone: 'America/New_York',
});

finalizeCrowdsaleJob.start();

var deployCrowdsaleJob = new CronJob({
	cronTime: '0,30 * * * * *', // every 15 seconds
	onTick: _ => {
		try {
			deployCrowdsale.run();
		} catch (e) {
			console.log('deployCrowdsale::run threw an exception', e);
		}
	},
	start: true,
	timeZone: 'America/New_York',
});

deployCrowdsaleJob.start();
