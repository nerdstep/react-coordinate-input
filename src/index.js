/**
 * @class CoordinateInput
 */

import React, { Component } from 'react'
import PropTypes from 'prop-types'
import MaskedInput from 'react-text-mask'

import createLatLongPipe from './createLatLongPipe'
import {
  createInputMask,
  dmsToDecimal,
  normalizeInput,
  parseDMS,
  validateDMS,
} from './utils'

export default class CoordinateInput extends Component {
  static propTypes = {
    className: PropTypes.string,
    ddPrecision: PropTypes.number,
    guide: PropTypes.bool,
    inputProps: PropTypes.object,
    maskSymbols: PropTypes.shape({
      degree: PropTypes.string,
      minute: PropTypes.string,
      second: PropTypes.string,
      spacer: PropTypes.string,
    }),
    name: PropTypes.string,
    onBlur: PropTypes.func,
    onChange: PropTypes.func,
    placeholder: PropTypes.string,
    placeholderChar: PropTypes.string,
    showMask: PropTypes.bool,
    value: PropTypes.string,
  }

  static defaultProps = {
    ddPrecision: 6,
    guide: true,
    maskSymbols: {
      degree: '°',
      minute: '′',
      second: '″',
      spacer: ' ',
    },
    onChange: () => {},
    placeholder: '04° 08′ 15″ N 162° 03′ 42″ E',
    placeholderChar: '_',
    showMask: false,
  }

  constructor(props) {
    super()

    const { maskSymbols } = props

    this.pipe = createLatLongPipe()
    this.mask = createInputMask(maskSymbols)
  }

  handleChange = e => {
    const { ddPrecision, onChange } = this.props
    const { value } = e.target
    const dms = normalizeInput(value)
    const valid = validateDMS(dms)

    // Callback if there's an empty value
    if (value.length === 0) {
      onChange(e, { dd: [], dms: '' })

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
    const {
      className,
      guide,
      inputProps,
      name,
      onBlur,
      placeholder,
      placeholderChar,
      showMask,
      value,
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
