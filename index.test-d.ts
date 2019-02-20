import {expectType} from 'tsd-check';
import carden, {Spacing, BorderStyle, CustomBorderStyle} from '.';

const border: CustomBorderStyle = {
	topLeft: ' ',
	topRight: ' ',
	bottomLeft: ' ',
	bottomRight: ' ',
	horizontal: ' ',
	vertical: ' '
};

const spacing: Spacing = {
	top: 1,
	right: 0,
	bottom: 1,
	left: 0
};

expectType<string>(carden('unicorns', 'are awesome'));
expectType<string>(carden('unicorns', 'are awesome', {borderColor: 'green'}));
expectType<string>(carden('unicorns', 'are awesome', {borderColor: '#ff0000'}));
expectType<string>(carden('unicorns', 'are awesome', {borderStyle: BorderStyle.Double}));
expectType<string>(carden('unicorns', 'are awesome', {borderStyle: border}));
expectType<string>(carden('unicorns', 'are awesome', {dimBorder: true}));
expectType<string>(carden('unicorns', 'are awesome', {padding: 3}));
expectType<string>(carden('unicorns', 'are awesome', {padding: spacing}));
expectType<string>(carden('unicorns', 'are awesome', {margin: 3}));
expectType<string>(carden('unicorns', 'are awesome', {margin: spacing}));
expectType<string>(carden('unicorns', 'are awesome', {float: 'center'}));
expectType<string>(carden('unicorns', 'are awesome', {backgroundColor: 'green'}));
expectType<string>(carden('unicorns', 'are awesome', {backgroundColor: '#ff0000'}));
expectType<string>(carden('unicorns', 'are awesome', {align: 'right'}));

expectType<string>(carden('unicorns', 'are awesome', {header: {borderColor: 'green'}}));
expectType<string>(carden('unicorns', 'are awesome', {header: {borderColor: '#ff0000'}}));
expectType<string>(carden('unicorns', 'are awesome', {header: {borderStyle: BorderStyle.Double}}));
expectType<string>(carden('unicorns', 'are awesome', {header: {borderStyle: border}}));
expectType<string>(carden('unicorns', 'are awesome', {header: {dimBorder: true}}));
expectType<string>(carden('unicorns', 'are awesome', {header: {padding: 3}}));
expectType<string>(carden('unicorns', 'are awesome', {header: {padding: spacing}}));
expectType<string>(carden('unicorns', 'are awesome', {header: {margin: 3}}));
expectType<string>(carden('unicorns', 'are awesome', {header: {margin: spacing}}));
expectType<string>(carden('unicorns', 'are awesome', {header: {float: 'center'}}));
expectType<string>(carden('unicorns', 'are awesome', {header: {backgroundColor: 'green'}}));
expectType<string>(carden('unicorns', 'are awesome', {header: {backgroundColor: '#ff0000'}}));
expectType<string>(carden('unicorns', 'are awesome', {header: {align: 'right'}}));

expectType<string>(carden('unicorns', 'are awesome', {content: {borderColor: 'green'}}));
expectType<string>(carden('unicorns', 'are awesome', {content: {borderColor: '#ff0000'}}));
expectType<string>(carden('unicorns', 'are awesome', {content: {borderStyle: BorderStyle.Double}}));
expectType<string>(carden('unicorns', 'are awesome', {content: {borderStyle: border}}));
expectType<string>(carden('unicorns', 'are awesome', {content: {dimBorder: true}}));
expectType<string>(carden('unicorns', 'are awesome', {content: {padding: 3}}));
expectType<string>(carden('unicorns', 'are awesome', {content: {padding: spacing}}));
expectType<string>(carden('unicorns', 'are awesome', {content: {margin: 3}}));
expectType<string>(carden('unicorns', 'are awesome', {content: {margin: spacing}}));
expectType<string>(carden('unicorns', 'are awesome', {content: {float: 'center'}}));
expectType<string>(carden('unicorns', 'are awesome', {content: {backgroundColor: 'green'}}));
expectType<string>(carden('unicorns', 'are awesome', {content: {backgroundColor: '#ff0000'}}));
expectType<string>(carden('unicorns', 'are awesome', {content: {align: 'right'}}));
