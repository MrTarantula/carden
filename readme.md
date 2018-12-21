# carden [![Build Status](https://travis-ci.org/mrtarantula/carden.svg?branch=master)](https://travis-ci.org/mrtarantula/carden)

> Create cards in the terminal. Forked from [sindresorhus/boxen](https://github.com/sindresorhus/boxen). The only difference between the two packages is that the header background and border color are configurable independent of the content background or border color.

![screenshot](screenshot.png)

## Install

```bash
npm install carden
```

## API

### carden(header, content, [options])

#### header

Type: `string`

Text inside the header area.

#### content

Type: `string`

Text inside the content area.

#### options

Type: `Object`

Options are the same as [sindresorhus/boxen](https://github.com/sindresorhus/boxen#options) but with the following additions:

##### headerBorderColor

Type: `string`<br>
Values: `black` `red` `green` `yellow` `blue` `magenta` `cyan` `white` `gray` or a hex value like `#ff0000`

Color of the header border. If not specified `borderColor` is used.

##### headerBackgroundColor

Type: `string`
Values: `black` `red` `green` `yellow` `blue` `magenta` `cyan` `white` `gray` or a hex value like `#ff0000`

Color of the header background. If not specified, `backgroundColor` is used.

##### headerAlign

Type: `string`<br>
Default: `left`<br>
Values: `left` `center` `right`

Align the text in the header based on the widest line of the header. If not specified, `align` property is used.
