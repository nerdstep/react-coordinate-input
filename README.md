# react-coordinate-input

> A masked input React component for entering latitude &amp; longitude coordinates as Degree Minute Second (DMS) values, with built-in conversion to Decimal Degrees.

[![NPM](https://img.shields.io/npm/v/react-coordinate-input.svg)](https://www.npmjs.com/package/react-coordinate-input) [![NPM](https://img.shields.io/npm/dt/react-coordinate-input.svg)](https://www.npmjs.com/package/react-coordinate-input) 

### [Demo](https://nerdstep.github.io/react-coordinate-input/)

## Install

```bash
npm install --save react-coordinate-input
```

## Usage

```jsx
import React, { Component } from 'react'

import CoordinateInput from 'react-coordinate-input'

class Example extends Component {
  handleChange = (e, decimalDegrees) => {
    console.log(e.target.value, decimalDegrees)
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
  // The onChange callback receives two arguments, 
  // the original event and an array containing the coordinates 
  // converted to decimal degrees ([latitude, longitude])
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

## License

MIT © [Justin M. Williams](https://github.com/nerdstep)
