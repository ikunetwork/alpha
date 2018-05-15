const finalizeCrowdsale = require('./jobs/finalize-crowdsale');

module.exports = {
	finalizeCrowdsale: function() {
		finalizeCrowdsale.run();
	},
};
