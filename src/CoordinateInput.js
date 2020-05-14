// @ts-check

import PropTypes from 'prop-types'
import React, { useEffect, useRef } from 'react'
import { useCoordMask } from './useCoordMask'

/**
 * CoordinateInput
 */
const CoordinateInput = ({
  className,
  degreeChar,
  minuteChar,
  secondChar,
  spacerChar,
  placeholderChar,
  ddPrecision,
  dmsPrecision,
  inputProps,
  inputRef,
  name,
  placeholder = '04° 08′ 15″ N 162° 03′ 42″ E',
  onBlur,
  onChange,
  value: controlledValue,
}) => {
  const innerRef = useRef(null)

  useCoordMask({
    inputRef: innerRef,
    controlledValue,
    degreeChar,
    minuteChar,
    secondChar,
    spacerChar,
    placeholderChar,
    ddPrecision,
    dmsPrecision,
    onChange,
  })

  /*const handleBlur = useCallback(
    (e) => {
      if (mask.isComplete) handleChange(mask.unmaskedValue, mask)
      if (typeof onBlur === 'function') onBlur(e)
    },
    [mask, onBlur]
  )*/

  useEffect(() => {
    if (typeof inputRef === 'function') {
      inputRef(innerRef.current)
    }
  }, [innerRef.current])

  return (
    <input
      {...inputProps}
      aria-label={name}
      dir="auto"
      className={className}
      name={name}
      placeholder={placeholder}
      ref={innerRef}
      type="text"
    />
  )
}

CoordinateInput.propTypes = {
  className: PropTypes.string,
  degreeChar: PropTypes.string,
  ddPrecision: PropTypes.number,
  dmsPrecision: PropTypes.number,
  minuteChar: PropTypes.string,
  name: PropTypes.string,
  onBlur: PropTypes.func,
  onChange: PropTypes.func.isRequired,
  placeholder: PropTypes.string,
  placeholderChar: PropTypes.string,
  inputProps: PropTypes.object,
  inputRef: PropTypes.func,
  secondChar: PropTypes.string,
  spacerChar: PropTypes.string,
  value: PropTypes.string,
}

export default CoordinateInput
