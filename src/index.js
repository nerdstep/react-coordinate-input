/**
 * @class CoordinateInput
 */

import React, { Component } from 'react'
import PropTypes from 'prop-types'
import MaskedInput from 'react-text-mask'

import createLatLongPipe from './createLatLongPipe'
import {
  createInputMask,
  createInputNormalizer,
  dmsToDecimal,
  parseDMS,
  validateDMS,
} from './utils'

export default class CoordinateInput extends Component {
  static propTypes = {
    className: PropTypes.string,
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
    this.normalizer = createInputNormalizer(maskSymbols)
  }

  handleChange = e => {
    const { onChange } = this.props
    const dms = this.normalizer(e.target.value)
    const valid = validateDMS(dms)

    if (valid) {
      const dmsObj = parseDMS(dms)
      const lat = dmsToDecimal(dmsObj.lat)
      const lon = dmsToDecimal(dmsObj.lon)

      // Callback with the original event and the converted values
      onChange(e, { dd: [lat, lon], dms })
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
