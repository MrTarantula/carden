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

	if (typeof borderStyle === 'string') {
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

	if (opts.headerBorderColor && !isColorValid(opts.headerBorderColor)) {
		throw new Error(`${opts.headerBorderColor} is not a valid headerBorderColor`);
	}

	if (opts.borderColor && !isColorValid(opts.borderColor)) {
		throw new Error(`${opts.borderColor} is not a valid borderColor`);
	}

	if (opts.headerBackgroundColor && !isColorValid(opts.headerBackgroundColor)) {
		throw new Error(`${opts.headerBackgroundColor} is not a valid headerBackgroundColor`);
	}

	if (opts.backgroundColor && !isColorValid(opts.backgroundColor)) {
		throw new Error(`${opts.backgroundColor} is not a valid backgroundColor`);
	}

	const chars = getBorderChars(opts.borderStyle);
	const padding = getObject(opts.padding);
	const margin = getObject(opts.margin);

	const colorizeHeaderBorder = x => {
		const ret = opts.headerBorderColor ? getColorFn(opts.headerBorderColor || opts.borderColor)(x) : x;
		return opts.dimBorder ? chalk.dim(ret) : ret;
	};

	const colorizeBorder = x => {
		const ret = opts.borderColor ? getColorFn(opts.borderColor)(x) : x;
		return opts.dimBorder ? chalk.dim(ret) : ret;
	};

	const colorizeHeaderContent = x => opts.headerBackgroundColor ? getBGColorFn(opts.headerBackgroundColor || opts.backgroundColor)(x) : x;
	const colorizeContent = x => opts.backgroundColor ? getBGColorFn(opts.backgroundColor)(x) : x;

	headerText = ansiAlign(headerText, {align: opts.headerAlign || opts.align});
	text = ansiAlign(text, {align: opts.align});

	const NL = '\n';
	const PAD = ' ';

	let headerLines = headerText.split(NL);
	let lines = text.split(NL);

	if (padding.top > 0) {
		headerLines = new Array(padding.top).fill('').concat(headerLines);
		lines = new Array(padding.top).fill('').concat(lines);
	}

	if (padding.bottom > 0) {
		headerLines = headerLines.concat(new Array(padding.bottom).fill(''));
		lines = lines.concat(new Array(padding.bottom).fill(''));
	}

	const contentWidth = (widestLine(text) >= widestLine(headerText) ? widestLine(text) : widestLine(headerText)) + padding.left + padding.right;
	const paddingLeft = PAD.repeat(padding.left);
	const {columns} = termSize();
	let marginLeft = PAD.repeat(margin.left);

	if (opts.float === 'center') {
		const padWidth = Math.max((columns - contentWidth) / 2, 0);
		marginLeft = PAD.repeat(padWidth);
	} else if (opts.float === 'right') {
		const padWidth = Math.max(columns - contentWidth - margin.right - 2, 0);
		marginLeft = PAD.repeat(padWidth);
	}

	const horizontal = chars.horizontal.repeat(contentWidth);
	const top = colorizeHeaderBorder(NL.repeat(margin.top) + marginLeft + chars.topLeft + horizontal + chars.topRight);
	const bottom = colorizeBorder(marginLeft + chars.bottomLeft + horizontal + chars.bottomRight + NL.repeat(margin.bottom));
	const headerSide = colorizeHeaderBorder(chars.vertical);
	const side = colorizeBorder(chars.vertical);

	const headerMiddle = headerLines.map(line => {
		const paddingRight = PAD.repeat(contentWidth - stringWidth(line) - padding.left);
		return marginLeft + headerSide + colorizeHeaderContent(paddingLeft + line + paddingRight) + headerSide;
	}).join(NL);

	const middle = lines.map(line => {
		const paddingRight = PAD.repeat(contentWidth - stringWidth(line) - padding.left);
		return marginLeft + side + colorizeContent(paddingLeft + line + paddingRight) + side;
	}).join(NL);

	return top + NL + headerMiddle + NL + middle + NL + bottom;
};

module.exports._borderStyles = cliBoxes;
