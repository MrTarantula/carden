import test from 'ava';
import chalk from 'chalk';
import carden from '.';

chalk.enabled = true;
chalk.level = 3;

const compare = (t, actual, expected) => t.is(actual.trim(), expected.trim());

test('creates a box', t => {
	compare(t, carden('foo', 'foo'), `
┌───┐
│foo│
│foo│
└───┘
	`);
});

test('padding option', t => {
	compare(t, carden('foo', 'foo', {
		padding: 2
	}), `
┌───────────────┐
│               │
│               │
│      foo      │
│               │
│               │
│               │
│               │
│      foo      │
│               │
│               │
└───────────────┘
	`);
});

test('padding option - advanced', t => {
	compare(t, carden('foo', 'foo', {
		padding: {
			top: 0,
			bottom: 2,
			left: 5,
			right: 10
		}
	}), `
┌──────────────────┐
│     foo          │
│                  │
│                  │
│     foo          │
│                  │
│                  │
└──────────────────┘
	`);
});

test('margin option', t => {
	compare(t, carden('foo', 'foo', {
		padding: 2,
		margin: 2
	}), `

      ┌───────────────┐
      │               │
      │               │
      │      foo      │
      │               │
      │               │
      │               │
      │               │
      │      foo      │
      │               │
      │               │
      └───────────────┘

    `);
});

test('float option (left)', t => {
	compare(t, carden('foo', 'foo', {
		float: 'left'
	}), `
┌───┐
│foo│
│foo│
└───┘
    `);
});

test('float option (center)', t => {
	const padSize = Math.ceil((process.stdout.columns - 2) / 2) - 1;
	const padding = ' '.repeat(padSize);

	compare(t, carden('foo', 'foo', {
		float: 'center'
	}), `
${padding}┌───┐
${padding}│foo│
${padding}│foo│
${padding}└───┘
${padding}    `);
});

test('float option (center) does not throw when content > columns', t => {
	const longContent = 'ab'.repeat(process.stdout.columns);
	t.notThrows(() => {
		carden('foo', longContent, {
			float: 'center'
		});
	});
});

test('float option (center) ignored when content > columns', t => {
	const longContent = 'ab'.repeat(process.stdout.columns);
	const gotWithCenter = carden('foo', longContent, {
		float: 'center'
	});
	const gotWithLeft = carden('foo', longContent, {
		float: 'left'
	});
	const gotWithRight = carden('foo', longContent, {
		float: 'right'
	});

	compare(t, gotWithCenter, gotWithLeft);
	compare(t, gotWithCenter, gotWithRight);
});

test('float option (right)', t => {
	const padSize = Math.max(process.stdout.columns - 4, 0) - 1;
	const padding = ' '.repeat(padSize);

	compare(t, carden('foo', 'foo', {
		float: 'right'
	}), `
${padding}┌───┐
${padding}│foo│
${padding}│foo│
${padding}└───┘
${padding}    `);
});

test('float option (right) with margin', t => {
	const marginWidth = 6;
	const padSize = Math.max(process.stdout.columns - 4 - marginWidth, 0) - 1;
	const padding = ' '.repeat(padSize);

	compare(t, carden('foo', 'foo', {
		float: 'right',
		margin: 2
	}), `


${padding}┌───┐
${padding}│foo│
${padding}│foo│
${padding}└───┘


`);
});

test('float option (right) with margin right', t => {
	const marginWidth = 2;
	const padSize = Math.max(process.stdout.columns - 4 - marginWidth, 0) - 1;
	const padding = ' '.repeat(padSize);

	compare(t, carden('foo', 'foo', {
		float: 'right',
		margin: {
			right: 2
		}
	}), `
${padding}┌───┐
${padding}│foo│
${padding}│foo│
${padding}└───┘
`);
});

test('borderStyle option `double`', t => {
	compare(t, carden('foo', 'foo', {borderStyle: 'double'}), `
╔═══╗
║foo║
║foo║
╚═══╝
	`);
});

test('borderStyle option `round`', t => {
	compare(t, carden('foo', 'foo', {borderStyle: 'round'}), `
╭───╮
│foo│
│foo│
╰───╯
	`);
});

test('borderStyle option `single-double`', t => {
	compare(t, carden('foo', 'foo', {borderStyle: 'singleDouble'}), `
╓───╖
║foo║
║foo║
╙───╜
	`);
});

test('borderStyle option `double-single`', t => {
	compare(t, carden('foo', 'foo', {borderStyle: 'doubleSingle'}), `
╒═══╕
│foo│
│foo│
╘═══╛
	`);
});

test('borderStyle option with object', t => {
	const asciiStyle = {
		topLeft: '1',
		topRight: '2',
		bottomLeft: '3',
		bottomRight: '4',
		horizontal: '-',
		vertical: '|'
	};

	compare(t, carden('foo', 'foo', {borderStyle: asciiStyle}), `
1---2
|foo|
|foo|
3---4
	`);
});

test('throws on unexpected borderStyle as string', t => {
	t.throws(() => carden('foo', 'foo', {borderStyle: 'shaken-snake'}), /border style/);
});

test('throws on unexpected borderStyle as object', t => {
	t.throws(() => carden('foo', 'foo', {borderStyle: {shake: 'snake'}}), /border style/);

	// Missing bottomRight
	const invalid = {
		topLeft: '1',
		topRight: '2',
		bottomLeft: '3',
		horizontal: '-',
		vertical: '|'
	};

	t.throws(() => carden('foo', 'foo', {borderStyle: invalid}), /bottomRight/);
});

test('borderColor option', t => {
	const box = carden('foo', 'foo', {borderColor: 'yellow'});
	const yellowAnsiOpen = '\u001B[33m';
	const colorAnsiClose = '\u001B[39m';
	t.true(box.includes(yellowAnsiOpen));
	t.true(box.includes(colorAnsiClose));
});

test('borderColor hex', t => {
	const box = carden('foo', 'foo', {borderColor: '#FF0000'});
	const rgbAnsiOpen = '\u001B[38;2;255;0;0m';
	const colorAnsiClose = '\u001B[39m';
	t.true(box.includes(rgbAnsiOpen));
	t.true(box.includes(colorAnsiClose));
});

test('throws on unexpected borderColor', t => {
	t.throws(() => carden('foo', 'foo', {borderColor: 'greasy-white'}), /borderColor/);
});

test('backgroundColor option', t => {
	const box = carden('foo', 'foo', {backgroundColor: 'red'});
	const redAnsiOpen = '\u001B[41m';
	const redAnsiClose = '\u001B[49m';
	t.true(box.includes(redAnsiOpen));
	t.true(box.includes(redAnsiClose));
});

test('backgroundColor hex', t => {
	const box = carden('foo', 'foo', {backgroundColor: '#FF0000'});
	const rgbAnsiOpen = '\u001B[48;2;255;0;0m';
	const colorAnsiClose = '\u001B[49m';
	t.true(box.includes(rgbAnsiOpen));
	t.true(box.includes(colorAnsiClose));
});

test('throws on unexpected backgroundColor', t => {
	t.throws(() => carden('foo', 'foo', {backgroundColor: 'dark-yellow'}), /backgroundColor/);
});

test('align option `center`', t => {
	const beautifulColor = chalk.magenta('B E A U T I F U L');
	compare(t, carden('foo', `Boxes are\n${beautifulColor}\nand beneficial too!`, {
		align: 'center',
		padding: 1
	}), `
┌─────────────────────────┐
│                         │
│   foo                   │
│                         │
│                         │
│        Boxes are        │
│    ${beautifulColor}    │
│   and beneficial too!   │
│                         │
└─────────────────────────┘
	`);
});

test('align option `right`', t => {
	const beautifulColor = chalk.magenta('B E A U T I F U L');
	compare(t, carden('foo', `Boxes are\n${beautifulColor}\nand beneficial too!`, {align: 'right'}), `
┌───────────────────┐
│foo                │
│          Boxes are│
│  ${beautifulColor}│
│and beneficial too!│
└───────────────────┘
	`);
});

test('align option `left`', t => {
	const beautifulColor = chalk.magenta('B E A U T I F U L');
	compare(t, carden('foo', `Boxes are\n${beautifulColor}\nand beneficial too!`, {align: 'left'}), `
┌───────────────────┐
│foo                │
│Boxes are          │
│${beautifulColor}  │
│and beneficial too!│
└───────────────────┘
	`);
});

test('dimBorder option', t => {
	const dimTopBorder = chalk.dim('┌───┐');
	const dimSide = chalk.dim('│');
	const dimBottomBorder = chalk.dim('└───┘');
	compare(t, carden('foo', 'foo', {dimBorder: true}), `
${dimTopBorder}
${dimSide}foo${dimSide}
${dimSide}foo${dimSide}
${dimBottomBorder}
	`);
});

test('header align option `center`', t => {
	const beautifulColor = chalk.magenta('B E A U T I F U L');
	compare(t, carden('foo\nmonkey', `Boxes are\n${beautifulColor}\nand beneficial too!`, {
		header: {
			align: 'center'
		},
		padding: 1
	}), `
┌─────────────────────────┐
│                         │
│    foo                  │
│   monkey                │
│                         │
│                         │
│   Boxes are             │
│   ${beautifulColor}     │
│   and beneficial too!   │
│                         │
└─────────────────────────┘
	`);
});

test('header align option `right`', t => {
	const beautifulColor = chalk.magenta('B E A U T I F U L');
	compare(t, carden('foo\nmonkey', `Boxes are\n${beautifulColor}\nand beneficial too!`, {
		header:
		{align: 'right'}
	}), `
┌───────────────────┐
│   foo             │
│monkey             │
│Boxes are          │
│${beautifulColor}  │
│and beneficial too!│
└───────────────────┘
	`);
});

test('content align option `center`', t => {
	const beautifulColor = chalk.magenta('B E A U T I F U L');
	compare(t, carden('foo\nmonkey', `Boxes are\n${beautifulColor}\nand beneficial too!`, {
		content: {align: 'center'},
		padding: 1
	}), `
┌─────────────────────────┐
│                         │
│   foo                   │
│   monkey                │
│                         │
│                         │
│        Boxes are        │
│    ${beautifulColor}    │
│   and beneficial too!   │
│                         │
└─────────────────────────┘
	`);
});

test('content align option `right`', t => {
	const beautifulColor = chalk.magenta('B E A U T I F U L');
	compare(t, carden('foo\nmonkey', `Boxes are\n${beautifulColor}\nand beneficial too!`, {
		content: {align: 'right'}
	}), `
┌───────────────────┐
│foo                │
│monkey             │
│          Boxes are│
│  ${beautifulColor}│
│and beneficial too!│
└───────────────────┘
	`);
});

test('header wider than content', t => {
	const beautifulColor = chalk.magenta('B E A U T I F U L');
	compare(t, carden(`Boxes are\n${beautifulColor}\nand beneficial too!`, 'foo\nmonkey', {
		align: 'right'
	}), `
┌───────────────────┐
│          Boxes are│
│  ${beautifulColor}│
│and beneficial too!│
│   foo             │
│monkey             │
└───────────────────┘
	`);
});

test('header backgroundColor option', t => {
	const box = carden('foo', 'foo', {
		header: {
			backgroundColor: 'red'
		}
	});
	const redAnsiOpen = '\u001B[41m';
	const redAnsiClose = '\u001B[49m';
	t.true(box.includes(redAnsiOpen));
	t.true(box.includes(redAnsiClose));
});

test('header backgroundColor hex', t => {
	const box = carden('foo', 'foo', {
		header: {
			backgroundColor: '#FF0000'
		}
	});
	const rgbAnsiOpen = '\u001B[48;2;255;0;0m';
	const colorAnsiClose = '\u001B[49m';
	t.true(box.includes(rgbAnsiOpen));
	t.true(box.includes(colorAnsiClose));
});

test('header borderColor option', t => {
	const box = carden('foo', 'foo', {header: {borderColor: 'yellow'}});
	const yellowAnsiOpen = '\u001B[33m';
	const colorAnsiClose = '\u001B[39m';
	t.true(box.includes(yellowAnsiOpen));
	t.true(box.includes(colorAnsiClose));
});

test('header borderColor hex', t => {
	const box = carden('foo', 'foo', {header: {borderColor: '#FF0000'}});
	const rgbAnsiOpen = '\u001B[38;2;255;0;0m';
	const colorAnsiClose = '\u001B[39m';
	t.true(box.includes(rgbAnsiOpen));
	t.true(box.includes(colorAnsiClose));
});

test('header dimBorder option', t => {
	const dimTopBorder = chalk.dim('┌───┐');
	const dimSide = chalk.dim('│');
	compare(t, carden('foo', 'foo', {header: {dimBorder: true}}), `
${dimTopBorder}
${dimSide}foo${dimSide}
│foo│
└───┘
	`);
});

test('throws on unexpected header borderColor', t => {
	t.throws(() => carden('foo', 'foo', {header: {borderColor: 'greasy-white'}}), /borderColor/);
});

test('throws on unexpected header backgroundColor', t => {
	t.throws(() => carden('foo', 'foo', {header: {backgroundColor: 'dark-yellow'}}), /backgroundColor/);
});

test('content backgroundColor option', t => {
	const box = carden('foo', 'foo', {
		content: {
			backgroundColor: 'red'
		}
	});
	const redAnsiOpen = '\u001B[41m';
	const redAnsiClose = '\u001B[49m';
	t.true(box.includes(redAnsiOpen));
	t.true(box.includes(redAnsiClose));
});

test('content backgroundColor hex', t => {
	const box = carden('foo', 'foo', {
		content: {
			backgroundColor: '#FF0000'
		}
	});
	const rgbAnsiOpen = '\u001B[48;2;255;0;0m';
	const colorAnsiClose = '\u001B[49m';
	t.true(box.includes(rgbAnsiOpen));
	t.true(box.includes(colorAnsiClose));
});

test('content dimBorder option', t => {
	const dimSide = chalk.dim('│');
	const dimBottomBorder = chalk.dim('└───┘');
	compare(t, carden('foo', 'foo', {content: {dimBorder: true}}), `
┌───┐
│foo│
${dimSide}foo${dimSide}
${dimBottomBorder}
	`);
});

test('content borderColor option', t => {
	const box = carden('foo', 'foo', {content: {borderColor: 'yellow'}});
	const yellowAnsiOpen = '\u001B[33m';
	const colorAnsiClose = '\u001B[39m';
	t.true(box.includes(yellowAnsiOpen));
	t.true(box.includes(colorAnsiClose));
});

test('content borderColor hex', t => {
	const box = carden('foo', 'foo', {content: {borderColor: '#FF0000'}});
	const rgbAnsiOpen = '\u001B[38;2;255;0;0m';
	const colorAnsiClose = '\u001B[39m';
	t.true(box.includes(rgbAnsiOpen));
	t.true(box.includes(colorAnsiClose));
});

test('throws on unexpected content borderColor', t => {
	t.throws(() => carden('foo', 'foo', {content: {borderColor: 'greasy-white'}}), /borderColor/);
});

test('throws on unexpected content backgroundColor', t => {
	t.throws(() => carden('foo', 'foo', {content: {backgroundColor: 'dark-yellow'}}), /backgroundColor/);
});

test('borderStyle option `none`', t => {
	compare(t, carden('foo', 'foo', {borderStyle: 'none'}), '\nfoo\nfoo');
});

test('borderStyle option `blank`', t => {
	compare(t, carden('foo', 'foo', {borderStyle: 'blank'}), '\nfoo \n foo');
});
