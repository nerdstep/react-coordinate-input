// @ts-check
// https://github.com/text-mask/text-mask/issues/887
// https://github.com/text-mask/text-mask/issues/806
// https://github.com/text-mask/text-mask/pull/807
import PropTypes from 'prop-types'
import React, { Component } from 'react'
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

const getMaskOptions = ({
  dmsPrecision,
  degreeChar,
  minuteChar,
  secondChar,
  spacerChar,
}) =>
  Object.assign(
    {},
    {
      degree: degreeChar,
      minute: minuteChar,
      second: secondChar,
      space: spacerChar,
      precision: dmsPrecision,
    }
  )

/**
 * @class CoordinateInput
 */
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
    inputRef: PropTypes.func,
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
    onBlur: () => {},
    onChange: () => {},
  }

  constructor(props) {
    super(props)

    const { dmsPrecision, value } = props

    this.state = {
      mask: createMask(getMaskOptions(props)),
      pipe: createLatLongPipe(dmsPrecision),
      value,
    }
  }

  static getDerivedStateFromProps(props) {
    const mask = createMask(getMaskOptions(props))
    const pipe = createLatLongPipe(props.dmsPrecision)
    const value = convertInput(props.value, props.dmsPrecision)

    return { mask, pipe, value }
  }

  handleBlur = () => {
    if (this.inputRef) {
      const { value } = this.inputRef.inputElement
      this.handleChange({ target: { value } })
    }

    this.props.onBlur()
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

      // @ts-ignore {https://github.com/Microsoft/TypeScript/pull/24897}
      const lat = dmsToDecimal(...dmsArray[0], ddPrecision)
      // @ts-ignore
      const lon = dmsToDecimal(...dmsArray[1], ddPrecision)

      //console.log('handleChange', { value, dmsArray, lat, lon })

      // Callback with the original event and the converted values
      onChange(e, { dd: [lat, lon], dms, dmsArray })
    }
  }

  setRef = ref => {
    if (ref) {
      this.inputRef = ref

      if (typeof this.props.inputRef === 'function') {
        this.props.inputRef(ref)
      }
    }
  }

  render() {
    const { mask, pipe, value } = this.state
    const {
      className,
      guide,
      inputProps,
      name,
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
        key={value}
        mask={mask}
        name={name}
        onBlur={this.handleBlur}
        onChange={this.handleChange}
        pipe={pipe}
        placeholder={placeholder}
        placeholderChar={placeholderChar}
        ref={this.setRef}
        showMask={showMask}
        type="text"
        value={value}
      />
    )
  }
}
