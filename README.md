# react-coordinate-input

> A masked input React component for entering latitude &amp; longitude coordinates as Degree Minute Second (DMS) values, with built-in conversion to Decimal Degrees.

[![NPM](https://img.shields.io/npm/v/react-coordinate-input.svg)](https://www.npmjs.com/package/react-coordinate-input)
[![NPM](https://img.shields.io/npm/dt/react-coordinate-input.svg)](https://www.npmjs.com/package/react-coordinate-input)
[![gzip size](http://img.badgesize.io/https://unpkg.com/react-coordinate-input/dist/index.js?compression=gzip)](https://unpkg.com/react-coordinate-input/dist/index.js)
[![license](https://img.shields.io/npm/l/react-coordinate-input.svg)](./LICENSE)

## Features

- Lightweight at ~8kb gzipped
- Masked input with [Text Mask](https://github.com/text-mask/text-mask)
- Coordinate validation
- Conversion to decimal degrees

## [Demo](https://nerdstep.github.io/react-coordinate-input/)

## Install

```bash
npm install --save react-coordinate-input
```

## Usage

```jsx
import React, { Component } from 'react'
import CoordinateInput from 'react-coordinate-input'

class Example extends Component {
  handleChange = (e, { dd, dms }) => {
    console.log(e.target.value, dd, dms)
  }

  render () {
    return (
      <CoordinateInput onChange={this.handleChange} />
    )
  }
}
```

## Props

Component props and their default values.

See the [Text Mask](https://github.com/text-mask/text-mask/blob/master/componentDocumentation.md#readme) docs for additional information on `guide`, `placeholderChar`, and `showMask` props.

```javascript
{
  className: undefined,
  // Tells the component whether to be in guide or no guide mode
  guide: true,
  // Use this to pass additional props to the underlying input
  inputProps: undefined,
  maskSymbols: {
    degree: '°',
    minute: '′',
    second: '″',
    spacer: ' ',
  },
  name: undefined,
  onBlur: undefined,
  onChange: () => {},
  placeholder: '04° 08′ 15″ N 162° 03′ 42″ E',
  // The placeholder character represents the fillable spot in the input mask
  placeholderChar: '_',
  // Tells the Text Mask component to display the mask as a placeholder,
  // in place of the regular placeholder when the input element value is empty.
  showMask: false,
  value: undefined,
}
```

### onChange

The `onChange` callback will only trigger once a valid coordinate has been entered.

The callback receives two arguments, the original event and an object with two properties:

```javascript
{
  // The DMS value converted to Decimal Degrees
  dd: [90, -180],
  // The normalized DMS value
  dms: '90.00.00N180.00.00W'
}
```

## License

MIT © [Justin M. Williams](https://github.com/nerdstep)
