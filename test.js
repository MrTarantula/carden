import test from 'ava';
import chalk from 'chalk';
import m from '.';

chalk.enabled = true;
chalk.level = 3;

const compare = (t, actual, expected) => t.is(actual.trim(), expected.trim());

test('creates a box', t => {
	compare(t, m('foo', 'foo'), `
┌───┐
│foo│
│foo│
└───┘
	`);
});

test('padding option', t => {
	compare(t, m('foo', 'foo', {
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
	compare(t, m('foo', 'foo', {
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
	compare(t, m('foo', 'foo', {
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
	compare(t, m('foo', 'foo', {
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

	compare(t, m('foo', 'foo', {
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
		m('foo', longContent, {
			float: 'center'
		});
	});
});

test('float option (center) ignored when content > columns', t => {
	const longContent = 'ab'.repeat(process.stdout.columns);
	const gotWithCenter = m('foo', longContent, {
		float: 'center'
	});
	const gotWithLeft = m('foo', longContent, {
		float: 'left'
	});
	const gotWithRight = m('foo', longContent, {
		float: 'right'
	});

	compare(t, gotWithCenter, gotWithLeft);
	compare(t, gotWithCenter, gotWithRight);
});

test('float option (right)', t => {
	const padSize = Math.max(process.stdout.columns - 4, 0) - 1;
	const padding = ' '.repeat(padSize);

	compare(t, m('foo', 'foo', {
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

	compare(t, m('foo', 'foo', {
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

	compare(t, m('foo', 'foo', {
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
	compare(t, m('foo', 'foo', {borderStyle: 'double'}), `
╔═══╗
║foo║
║foo║
╚═══╝
	`);
});

test('borderStyle option `round`', t => {
	compare(t, m('foo', 'foo', {borderStyle: 'round'}), `
╭───╮
│foo│
│foo│
╰───╯
	`);
});

test('borderStyle option `single-double`', t => {
	compare(t, m('foo', 'foo', {borderStyle: 'single-double'}), `
╓───╖
║foo║
║foo║
╙───╜
	`);
});

test('borderStyle option `double-single`', t => {
	compare(t, m('foo', 'foo', {borderStyle: 'double-single'}), `
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

	compare(t, m('foo', 'foo', {borderStyle: asciiStyle}), `
1---2
|foo|
|foo|
3---4
	`);
});

test('throws on unexpected borderStyle as string', t => {
	t.throws(() => m('foo', 'foo', {borderStyle: 'shaken-snake'}), /border style/);
});

test('throws on unexpected borderStyle as object', t => {
	t.throws(() => m('foo', 'foo', {borderStyle: {shake: 'snake'}}), /border style/);

	// Missing bottomRight
	const invalid = {
		topLeft: '1',
		topRight: '2',
		bottomLeft: '3',
		horizontal: '-',
		vertical: '|'
	};

	t.throws(() => m('foo', 'foo', {borderStyle: invalid}), /bottomRight/);
});

test('borderColor option', t => {
	const box = m('foo', 'foo', {borderColor: 'yellow'});
	const yellowAnsiOpen = '\u001B[33m';
	const colorAnsiClose = '\u001B[39m';
	t.true(box.includes(yellowAnsiOpen));
	t.true(box.includes(colorAnsiClose));
});

test('borderColor hex', t => {
	const box = m('foo', 'foo', {borderColor: '#FF0000'});
	const rgbAnsiOpen = '\u001B[38;2;255;0;0m';
	const colorAnsiClose = '\u001B[39m';
	t.true(box.includes(rgbAnsiOpen));
	t.true(box.includes(colorAnsiClose));
});

test('throws on unexpected borderColor', t => {
	t.throws(() => m('foo', 'foo', {borderColor: 'greasy-white'}), /borderColor/);
});

test('backgroundColor option', t => {
	const box = m('foo', 'foo', {backgroundColor: 'red'});
	const redAnsiOpen = '\u001B[41m';
	const redAnsiClose = '\u001B[49m';
	t.true(box.includes(redAnsiOpen));
	t.true(box.includes(redAnsiClose));
});

test('backgroundColor hex', t => {
	const box = m('foo', 'foo', {backgroundColor: '#FF0000'});
	const rgbAnsiOpen = '\u001B[48;2;255;0;0m';
	const colorAnsiClose = '\u001B[49m';
	t.true(box.includes(rgbAnsiOpen));
	t.true(box.includes(colorAnsiClose));
});

test('throws on unexpected backgroundColor', t => {
	t.throws(() => m('foo', 'foo', {backgroundColor: 'dark-yellow'}), /backgroundColor/);
});

test('align option `center`', t => {
	const beautifulColor = chalk.magenta('B E A U T I F U L');
	compare(t, m('foo', `Boxes are\n${beautifulColor}\nand beneficial too!`, {
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
	compare(t, m('foo', `Boxes are\n${beautifulColor}\nand beneficial too!`, {align: 'right'}), `
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
	compare(t, m('foo', `Boxes are\n${beautifulColor}\nand beneficial too!`, {align: 'left'}), `
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
	compare(t, m('foo', 'foo', {dimBorder: true}), `
${dimTopBorder}
${dimSide}foo${dimSide}
${dimSide}foo${dimSide}
${dimBottomBorder}
	`);
});

test('header align option `center`', t => {
	const beautifulColor = chalk.magenta('B E A U T I F U L');
	compare(t, m('foo\nmonkey', `Boxes are\n${beautifulColor}\nand beneficial too!`, {
		align: 'center',
		padding: 1
	}), `
┌─────────────────────────┐
│                         │
│    foo                  │
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

test('header align option `right`', t => {
	const beautifulColor = chalk.magenta('B E A U T I F U L');
	compare(t, m('foo\nmonkey', `Boxes are\n${beautifulColor}\nand beneficial too!`, {
		align: 'right'
	}), `
┌───────────────────┐
│   foo             │
│monkey             │
│          Boxes are│
│  ${beautifulColor}│
│and beneficial too!│
└───────────────────┘
	`);
});

test('header wider than content', t => {
	const beautifulColor = chalk.magenta('B E A U T I F U L');
	compare(t, m(`Boxes are\n${beautifulColor}\nand beneficial too!`, 'foo\nmonkey', {
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

test('headerBackgroundColor option', t => {
	const box = m('foo', 'foo', {
		headerBackgroundColor: 'red'
	});
	const redAnsiOpen = '\u001B[41m';
	const redAnsiClose = '\u001B[49m';
	t.true(box.includes(redAnsiOpen));
	t.true(box.includes(redAnsiClose));
});

test('headerBackgroundColor hex', t => {
	const box = m('foo', 'foo', {
		headerBackgroundColor: '#FF0000'
	});
	const rgbAnsiOpen = '\u001B[48;2;255;0;0m';
	const colorAnsiClose = '\u001B[49m';
	t.true(box.includes(rgbAnsiOpen));
	t.true(box.includes(colorAnsiClose));
});

test('throws on unexpected headerBorderColor', t => {
	t.throws(() => m('foo', 'foo', {headerBorderColor: 'greasy-white'}), /headerBorderColor/);
});

test('throws on unexpected headerBackgroundColor', t => {
	t.throws(() => m('foo', 'foo', {headerBackgroundColor: 'dark-yellow'}), /headerBackgroundColor/);
});
