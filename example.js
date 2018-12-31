'use strict';
const chalk = require('chalk');
const carden = require('.');

console.log(carden('Chidi',
	'You put the Peeps in the chili \npot and it makes it taste bad.', {
		header: {
			backgroundColor: 'blue'
		}
	}));

console.log(carden('Tahani',
	`It's not about who you know. Enlightenment comes from within.

The Dalai Lama texted me that.`, {
		margin: 2,
		header: {
			backgroundColor: 'blue',
			padding: 1
		},
		content: {
			borderStyle: 'classic',
			borderColor: 'yellow'
		}
	}));

console.log(carden('Eleanor',
	`That Eleanor is a better Eleanor than this one. And
that is not easy for me to say.

"You're not better than me" was my yearbook quote.`, {
		borderStyle: 'double',
		borderColor: 'green',
		header: {
			backgroundColor: 'blue',
			padding: 1
		}
	}));

console.log(carden('Jason',
	chalk.black(`I always trust dudes in bow ties. Once, this guy
in a bow tie came up to me at the gun range in a
Jacksonville bus station and said he'd give me
$600 if I put these weird turtles in my duffle
bag and brought them to Daytona Beach.

So I hotwired a swamp boat to Daytona and the guy
paid me the $600. My point is, you always trust
dudes in bow ties.`), {
		padding: 1,
		header: {
			backgroundColor: 'blue',
			borderStyle: 'classic',
			borderColor: 'cyan'
		},
		content: {
			backgroundColor: 'white',
			borderStyle: 'round',
			borderColor: 'yellow'
		}
	}));

console.log(carden('Janet',
	`Is it an error to act unpredictably and behave in 
ways that run counter to how you were programmed
to behave?`, {
		margin: 1,
		borderStyle: 'single',
		padding: 1,
		header: {
			backgroundColor: 'green'
		},
		content: {
			backgroundColor: 'blue'
		}
	}));

console.log(carden('Janet',
	`Is it an error to act unpredictably and behave in 
ways that run counter to how you were programmed
to behave?`, {
		margin: 1,
		borderStyle: 'blank',
		padding: 1,
		header: {
			backgroundColor: 'green'
		},
		content: {
			backgroundColor: 'blue'
		}
	}));

console.log(carden('Janet',
	`Is it an error to act unpredictably and behave in 
ways that run counter to how you were programmed
to behave?`, {
		margin: 1,
		borderStyle: 'none',
		padding: 1,
		header: {
			backgroundColor: 'green'
		},
		content: {
			backgroundColor: 'blue'
		}
	}));
