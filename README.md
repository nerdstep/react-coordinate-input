# react-coordinate-input

> A masked input React component for entering latitude &amp; longitude coordinates as Degree Minute Second (DMS) values, with built-in conversion to Decimal Degrees.

[![NPM](https://flat.badgen.net/npm/v/react-coordinate-input)](https://www.npmjs.com/package/react-coordinate-input)
[![NPM](https://flat.badgen.net/npm/dt/react-coordinate-input)](https://www.npmjs.com/package/react-coordinate-input)
[![gzip size](https://flat.badgen.net/bundlephobia/minzip/react-coordinate-input)](https://bundlephobia.com/result?p=react-coordinate-input)
[![code coverage](https://flat.badgen.net/coveralls/c/github/nerdstep/react-coordinate-input)](https://coveralls.io/github/nerdstep/react-coordinate-input)
[![ci](https://github.com/nerdstep/react-coordinate-input/workflows/ci/badge.svg?branch=master)](https://github.com/nerdstep/react-coordinate-input/actions?query=workflow%3Aci)
[![license](https://flat.badgen.net/github/license/nerdstep/react-coordinate-input)](./LICENSE)

## Features

- Masked input with [imaskjs](https://github.com/uNmAnNeR/imaskjs)
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
import React from 'react'
import CoordinateInput from 'react-coordinate-input'

const Example = () => {
  return (
    <CoordinateInput
      onChange={(value, { unmaskedValue, dd, dms }) => {
        console.log(value, unmaskedValue, dd, dms)
      }}
    />
  )
}
```

## Props

Component props and their default values.

```javascript
{
  // See below for more info on the onChange callback
  onChange: undefined,
  // Input placeholder; this will only be visible if `placeholderChar` is set to `null`
  placeholder: '04° 08′ 15″ N 162° 03′ 42″ E',
  // Number of decimal places to round decimal degrees to (0-8)
  ddPrecision: 6,
  // Number of decimal places for Seconds value on input (0-6)
  dmsPrecision: 0,
  // Callback function which receives the input ref
  inputRef: undefined,
  // DMS characters used in the input mask
  degreeChar: '°',
  minuteChar: '′',
  secondChar: '″',
  spacerChar: ' ',
  // The placeholder character represents the fillable spot in the input mask
  // Setting this to null will not display the mask guides
  placeholderChar: '_',
  // Input value -- see below for more info
  value: undefined,
}
```

### onChange

The `onChange` callback will only trigger once a valid coordinate has been entered or the input has been cleared.

The callback receives two arguments, the first being the masked input value, e.g. `90° 00′ 00″ N 180° 00′ 00″ W`, and the second is an object with three properties:

```javascript
{
  // The normalized DMS value
  unmaskedValue: '900000N1800000W',
  // The DMS value converted to Decimal Degrees
  dd: [90, -180],
  // DMS values split into an array of arrays,
  // e.g. [[D, M, S, 'N|S'], [D, M, S, 'E|W']]
  dms: [
    [90, 0, 0, 'N'], [180, 0, 0, 'W']
  ]
}
```

### Input value

When providing a value to the input the following formats are supported:

1. DMS value which conforms to the input mask, e.g. `04° 08′ 15″ N 162° 03′ 42″ E`

**Note:** The DMS symbols and spaces are not required; a minimal input would also work, e.g. `040815N1620342E`

The only requirement is that each value has the required number of characters, i.e. `04` not `4` for degrees, minutes, seconds, etc., except for longitude degrees which requires three characters.

2. Decimal degree string can also be used, e.g. `4.1375, 162.061667`

The component will detect the DD value and convert it to a DMS value automatically.

## Exports

In addition to the default `CoordinateInput` export, the following helper utilities are also exported for convenience:

**dmsToDecimal**

```js
/**
 * dmsToDecimal
 *
 * Converts Degrees Minutes Seconds to Decimal Degrees
 *
 * Formula:
 * DD = D + M / 60 + S / 3600
 *
 * @param {number} degrees
 * @param {number} minutes
 * @param {number} seconds
 * @param {string} direction Compass direction, e.g. N|S|E|W
 * @param {number} [precision]  Decimal places (default: 6)
 * @returns {number} Decimal degrees, e.g. 42.451
 */
```

**decimalToDMS**

```js
/**
 * decimalToDMS
 *
 * Converts Decimal Degress to Degrees Minutes Seconds
 *
 * @param {number} dd Decimal degree value
 * @param {boolean} isLon Is longitude?
 * @param {number} [precision] Decimal places for seconds (default: 0)
 * @returns {(string|number)[]} DMS values, e.g. [D, M, S, 'N|S|E|W']
 */
```

## License

MIT © [Justin M. Williams](https://github.com/nerdstep)
