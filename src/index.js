/**
 * @class CoordinateInput
 */

import React, { Component } from 'react'
import PropTypes from 'prop-types'
import MaskedInput from 'react-text-mask'

import createLatLongPipe from './createLatLongPipe'
import createMask from './createMask'
import {
  convertInput,
  dmsToDecimal,
  normalizeInput,
  parseDMS,
  validateDMS,
} from './utils'

export default class CoordinateInput extends Component {
  static propTypes = {
    className: PropTypes.string,
    degreeChar: PropTypes.string,
    ddPrecision: PropTypes.number,
    dmsPrecision: PropTypes.number,
    guide: PropTypes.bool,
    minuteChar: PropTypes.string,
    name: PropTypes.string,
    onBlur: PropTypes.func,
    onChange: PropTypes.func,
    placeholder: PropTypes.string,
    placeholderChar: PropTypes.string,
    inputProps: PropTypes.object,
    secondChar: PropTypes.string,
    showMask: PropTypes.bool,
    spacerChar: PropTypes.string,
    value: PropTypes.string,
  }

  static defaultProps = {
    guide: true,
    showMask: false,
    ddPrecision: 6,
    dmsPrecision: 0,
    placeholder: '04° 08′ 15″ N 162° 03′ 42″ E',
    placeholderChar: '_',
    degreeChar: '°',
    minuteChar: '′',
    secondChar: '″',
    spacerChar: ' ',
    onChange: () => {},
  }

  constructor(props) {
    super()

    const {
      dmsPrecision,
      degreeChar,
      minuteChar,
      secondChar,
      spacerChar,
      value,
    } = props

    const maskOpts = Object.assign(
      {},
      {
        degree: degreeChar,
        minute: minuteChar,
        second: secondChar,
        space: spacerChar,
        precision: dmsPrecision,
      }
    )

    this.state = {
      value,
    }

    this.pipe = createLatLongPipe(dmsPrecision)
    this.mask = createMask(maskOpts)
  }

  static getDerivedStateFromProps(props) {
    const value = convertInput(props.value, props.dmsPrecision)
    return { value }
  }

  handleChange = e => {
    const { ddPrecision, onChange } = this.props
    const { value } = e.target
    const dms = normalizeInput(value)
    const valid = validateDMS(dms)

    // Callback if there's an empty value
    if (value.length === 0) {
      onChange(e, { dd: [], dms: '', dmsArray: [] })

      // Otherwise only callback if the value is a valid DMS
    } else if (valid) {
      const dmsArray = parseDMS(dms)
      const lat = dmsToDecimal(...dmsArray[0], ddPrecision)
      const lon = dmsToDecimal(...dmsArray[1], ddPrecision)

      // Callback with the original event and the converted values
      onChange(e, { dd: [lat, lon], dms, dmsArray })
    }
  }

  render() {
    const { value } = this.state
    const {
      className,
      guide,
      inputProps,
      name,
      onBlur,
      placeholder,
      placeholderChar,
      showMask,
    } = this.props

    return (
      <MaskedInput
        {...inputProps}
        dir="auto"
        guide={guide}
        className={className}
        mask={this.mask}
        name={name}
        onBlur={onBlur}
        onChange={this.handleChange}
        pipe={this.pipe}
        placeholder={placeholder}
        placeholderChar={placeholderChar}
        showMask={showMask}
        type="text"
        value={value}
      />
    )
  }
}
