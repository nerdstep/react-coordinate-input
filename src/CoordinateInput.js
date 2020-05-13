// @ts-check
// https://github.com/text-mask/text-mask/issues/887
// https://github.com/text-mask/text-mask/issues/806
// https://github.com/text-mask/text-mask/pull/807
import PropTypes from 'prop-types'
import React, { useCallback, useEffect, useRef } from 'react'
import MaskedInput from 'react-text-mask'
import { useCoordMask } from './useCoordMask'
import { dmsToDecimal, normalizeInput, parseDMS, validateDMS } from './utils'

const noop = () => {}

/**
 * CoordinateInput
 */
const CoordinateInput = props => {
  const {
    className,
    guide = true,
    inputProps,
    inputRef,
    showMask = false,
    ddPrecision = 6,
    placeholder = '04° 08′ 15″ N 162° 03′ 42″ E',
    placeholderChar = '_',
    onBlur = noop,
    onChange = noop,
  } = props

  const innerRef = useRef()
  const { mask, pipe, value } = useCoordMask(props)

  console.log(mask)

  const handleChange = useCallback(
    e => {
      const { value } = e.target
      const dms = normalizeInput(value)
      const valid = validateDMS(dms)

      // Callback if there's an empty value
      if (!value.length) {
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
    },
    [onChange]
  )

  const handleBlur = useCallback(
    e => {
      handleChange({ target: { value: e.target.value } })
      onBlur(e)
    },
    [onBlur]
  )

  useEffect(() => {
    if (typeof inputRef === 'function' && innerRef.current) {
      //console.log(innerRef.current.inputElement)
      inputRef(innerRef.current)
    }
  }, [innerRef.current, inputRef])

  return (
    <MaskedInput
      {...inputProps}
      aria-label={name}
      dir="auto"
      guide={guide}
      className={className}
      key={value}
      mask={mask}
      name={name}
      onBlur={handleBlur}
      onChange={handleChange}
      pipe={pipe}
      placeholder={placeholder}
      placeholderChar={placeholderChar}
      ref={innerRef}
      showMask={showMask}
      type="text"
      value={value}
    />
  )
}

CoordinateInput.propTypes = {
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

export default CoordinateInput
