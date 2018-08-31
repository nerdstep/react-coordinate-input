# react-coordinate-input

> A masked input React component for entering latitude &amp; longitude coordinates as Degree Minute Second (DMS) values, with built-in conversion to Decimal Degrees.

[![NPM](https://flat.badgen.net/npm/v/react-coordinate-input)](https://www.npmjs.com/package/react-coordinate-input)
[![NPM](https://flat.badgen.net/npm/dt/react-coordinate-input)](https://www.npmjs.com/package/react-coordinate-input)
[![gzip size](https://flat.badgen.net/bundlephobia/minzip/react-coordinate-input)](https://bundlephobia.com/result?p=react-coordinate-input)
[![codecov](https://flat.badgen.net/codecov/c/github/nerdstep/react-coordinate-input)](https://codecov.io/gh/nerdstep/react-coordinate-input)
[![Greenkeeper badge](https://flat.badgen.net/badge/Greenkeeper/enabled/green)](https://greenkeeper.io/)
[![Build Status](https://flat.badgen.net/travis/nerdstep/react-coordinate-input)](https://travis-ci.org/nerdstep/react-coordinate-input)
[![license](https://flat.badgen.net/github/license/nerdstep/react-coordinate-input)](./LICENSE)

## Features

- Masked input with [Text Mask](https://github.com/text-mask/text-mask)
- Coordinate validation
- Conversion to decimal degrees
- Accepts decimal degree passed in as `value` prop
- Second precision up to 6 decimal places
- Decimal degree precision up to 8 decimal places

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
  handleChange = (e, { dd, dms, dmsArray }) => {
    console.log(e.target.value, dd, dms, dmsArray)
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
  name: undefined,
  onBlur: undefined,
  placeholder: '04° 08′ 15″ N 162° 03′ 42″ E',

  // See below for more info on the onChange callback
  onChange: () => {},

  // Number of decimal places to round decimal degrees to (0-8)
  ddPrecision: 6,

  // Number of decimal places for Seconds value on input (0-6)
  dmsPrecision: 0,

  // Tells the component whether to be in guide or no guide mode
  guide: true,

  // Tells the Text Mask component to display the mask as a placeholder,
  // in place of the regular placeholder when the input element value is empty.
  showMask: false,

  // Use this to pass additional props to the underlying input
  inputProps: undefined,

  // The placeholder character represents the fillable spot in the input mask
  placeholderChar: '_',

  // DMS characters used in the input mask
  degreeChar: '°',
  minuteChar: '′',
  secondChar: '″',
  spacerChar: ' ',

  // Input value -- see below for more info
  value: undefined,
}
```

### onChange

The `onChange` callback will only trigger once a valid coordinate has been entered or the input has been cleared.

The callback receives two arguments, the original event and an object with three properties:

```javascript
{
  // The DMS value converted to Decimal Degrees
  dd: [90, -180],
  // The normalized DMS value
  dms: '90:00:00:N:180:00:00:W',
  // DMS values split into an array of arrays,
  // e.g. [[D, M, S, 'N|S'], [D, M, S, 'E|W']]
  dmsArray: [
    [90, 0, 0, 'N'], [180, 0, 0, 'W']
  ]
}
```

### Input value

When providing a value to the input the following formats are supported:

1. DMS value which conforms to the input mask, e.g. `04° 08′ 15″ N 162° 03′ 42″ E`

**Note:** The DMS symbols are not required, a minimal input would also work, e.g. `04 08 15N 162 03 42E`

The only requirement is that a separating character is between each value and each value is two characters, i.e. `04` not `4`, except for longitude degrees which requires three characters.

2. Decimal degree string can also be used, e.g. `4.1375, 162.061667`

The component will detect the DD value and convert it to a DMS value automatically.


## License

MIT © [Justin M. Williams](https://github.com/nerdstep)
