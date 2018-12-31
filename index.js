'use strict';
const stringWidth = require('string-width');
const chalk = require('chalk');
const widestLine = require('widest-line');
const cliBoxes = require('cli-boxes');
const camelCase = require('camelcase');
const ansiAlign = require('ansi-align');
const termSize = require('term-size');

const getObject = detail => {
	let obj;

	if (typeof detail === 'number') {
		obj = {
			top: detail,
			right: detail * 3,
			bottom: detail,
			left: detail * 3
		};
	} else {
		obj = Object.assign({
			top: 0,
			right: 0,
			bottom: 0,
			left: 0
		}, detail);
	}

	return obj;
};

const getBorderChars = borderStyle => {
	const sides = [
		'topLeft',
		'topRight',
		'bottomRight',
		'bottomLeft',
		'vertical',
		'horizontal'
	];

	let chars;

	if (borderStyle === 'none') {
		chars = {
			topLeft: '',
			topRight: '',
			bottomLeft: '',
			bottomRight: '',
			horizontal: '',
			vertical: ''
		};
	} else if (borderStyle === 'blank') {
		chars = {
			topLeft: ' ',
			topRight: ' ',
			bottomLeft: ' ',
			bottomRight: ' ',
			horizontal: ' ',
			vertical: ' '
		};
	} else if (typeof borderStyle === 'string') {
		chars = cliBoxes[borderStyle];

		if (!chars) {
			throw new TypeError(`Invalid border style: ${borderStyle}`);
		}
	} else {
		sides.forEach(key => {
			if (!borderStyle[key] || typeof borderStyle[key] !== 'string') {
				throw new TypeError(`Invalid border style: ${key}`);
			}
		});

		chars = borderStyle;
	}

	return chars;
};

const isHex = color => color.match(/^#[0-f]{3}(?:[0-f]{3})?$/i);
const isColorValid = color => typeof color === 'string' && ((chalk[color]) || isHex(color));
const getColorFn = color => isHex(color) ? chalk.hex(color) : chalk[color];
const getBGColorFn = color => isHex(color) ? chalk.bgHex(color) : chalk[camelCase(['bg', color])];

module.exports = (headerText, text, opts) => {
	opts = Object.assign({
		padding: 0,
		borderStyle: 'single',
		dimBorder: false,
		align: 'left',
		float: 'left'
	}, opts);

	if (opts.borderColor && !isColorValid(opts.borderColor)) {
		throw new Error(`${opts.borderColor} is not a valid borderColor`);
	}

	if (opts.backgroundColor && !isColorValid(opts.backgroundColor)) {
		throw new Error(`${opts.backgroundColor} is not a valid backgroundColor`);
	}

	if (opts.header && opts.header.borderColor && !isColorValid(opts.header.borderColor)) {
		throw new Error(`${opts.header.borderColor} is not a valid borderColor`);
	}

	if (opts.content && opts.content.borderColor && !isColorValid(opts.content.borderColor)) {
		throw new Error(`${opts.content.borderColor} is not a valid borderColor`);
	}

	if (opts.header && opts.header.backgroundColor && !isColorValid(opts.header.backgroundColor)) {
		throw new Error(`${opts.header.backgroundColor} is not a valid backgroundColor`);
	}

	if (opts.content && opts.content.backgroundColor && !isColorValid(opts.content.backgroundColor)) {
		throw new Error(`${opts.content.backgroundColor} is not a valid backgroundColor`);
	}

	const margin = getObject(opts.margin);
	const contentChars = getBorderChars(opts.content ? opts.content.borderStyle || opts.borderStyle : opts.borderStyle);
	const contentPadding = getObject(opts.content ? opts.content.padding || opts.padding : opts.padding);
	const headerChars = getBorderChars(opts.header ? opts.header.borderStyle || opts.borderStyle : opts.borderStyle);
	const headerPadding = getObject(opts.header ? opts.header.padding || opts.padding : opts.padding);

	const colorizeHeaderBorder = x => {
		let ret;
		if (opts.header && opts.header.borderColor) {
			ret = getColorFn(opts.header.borderColor)(x);
		} else if (opts.borderColor) {
			ret = getColorFn(opts.borderColor)(x);
		} else {
			ret = x;
		}

		return opts.header ? opts.header.dimBorder ? chalk.dim(ret) : ret : opts.dimBorder ? chalk.dim(ret) : ret;
	};

	const colorizeBorder = x => {
		let ret;
		if (opts.content && opts.content.borderColor) {
			ret = getColorFn(opts.content.borderColor)(x);
		} else if (opts.borderColor) {
			ret = getColorFn(opts.borderColor)(x);
		} else {
			ret = x;
		}

		return opts.content ? opts.content.dimBorder ? chalk.dim(ret) : ret : opts.dimBorder ? chalk.dim(ret) : ret;
	};

	const colorizeHeader = x => {
		if (opts.header && opts.header.backgroundColor) {
			return getBGColorFn(opts.header.backgroundColor)(x);
		}

		if (opts.backgroundColor) {
			return getBGColorFn(opts.backgroundColor)(x);
		}

		return x;
	};

	const colorizeContent = x => {
		if (opts.content && opts.content.backgroundColor) {
			return getBGColorFn(opts.content.backgroundColor)(x);
		}

		if (opts.backgroundColor) {
			return getBGColorFn(opts.backgroundColor)(x);
		}

		return x;
	};

	let headerAlign;
	if (opts.header && opts.header.align) {
		headerAlign = opts.header.align;
	} else {
		headerAlign = opts.align;
	}

	headerText = ansiAlign(headerText, {align: headerAlign});

	let contentAlign;
	if (opts.content && opts.content.align) {
		contentAlign = opts.content.align;
	} else {
		contentAlign = opts.align;
	}

	text = ansiAlign(text, {align: contentAlign});

	const NL = '\n';
	const PAD = ' ';

	let headerLines = headerText.split(NL);
	let lines = text.split(NL);

	if (contentPadding.top > 0) {
		lines = new Array(contentPadding.top).fill('').concat(lines);
	}

	if (headerPadding.top > 0) {
		headerLines = new Array(headerPadding.top).fill('').concat(headerLines);
	}

	if (contentPadding.bottom > 0) {
		lines = lines.concat(new Array(contentPadding.bottom).fill(''));
	}

	if (headerPadding.bottom > 0) {
		headerLines = headerLines.concat(new Array(headerPadding.bottom).fill(''));
	}

	const {columns} = termSize();
	const contentWidth = widestLine(text) + contentPadding.left + contentPadding.right;
	const headerWidth = widestLine(headerText) + headerPadding.left + headerPadding.right;
	const widestWidth = contentWidth > headerWidth ? contentWidth : headerWidth;

	let marginLeft = PAD.repeat(margin.left);

	if (opts.float === 'center') {
		const padWidth = Math.max((columns - widestWidth) / 2, 0);
		marginLeft = PAD.repeat(padWidth);
	} else if (opts.float === 'right') {
		const padWidth = Math.max(columns - widestWidth - margin.right - 2, 0);
		marginLeft = PAD.repeat(padWidth);
	}

	const top = colorizeHeaderBorder(NL.repeat(margin.top) + marginLeft + headerChars.topLeft + headerChars.horizontal.repeat(widestWidth) + headerChars.topRight);
	const bottom = colorizeBorder(marginLeft + contentChars.bottomLeft + contentChars.horizontal.repeat(widestWidth) + contentChars.bottomRight + NL.repeat(margin.bottom));
	const headerSide = colorizeHeaderBorder(headerChars.vertical);
	const side = colorizeBorder(contentChars.vertical);

	const headerMiddle = headerLines.map(line => {
		const paddingRight = PAD.repeat(widestWidth - stringWidth(line) - headerPadding.left);
		return marginLeft + headerSide + colorizeHeader(PAD.repeat(headerPadding.left) + line + paddingRight) + headerSide;
	}).join(NL);

	const middle = lines.map(line => {
		const paddingRight = PAD.repeat(widestWidth - stringWidth(line) - contentPadding.left);
		return marginLeft + side + colorizeContent(PAD.repeat(contentPadding.left) + line + paddingRight) + side;
	}).join(NL);

	return top + NL + headerMiddle + NL + middle + NL + bottom;
};

module.exports._borderStyles = cliBoxes;
