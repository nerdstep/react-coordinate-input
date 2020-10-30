// @ts-check
import PropTypes from 'prop-types'
import React, { useEffect, useRef } from 'react'
import { useCoordMask } from './useCoordMask'

/**
 * CoordinateInput
 */
const CoordinateInput = ({
  degreeChar,
  minuteChar,
  secondChar,
  spacerChar,
  placeholderChar,
  ddPrecision,
  dmsPrecision,
  inputRef,
  placeholder = '04° 08′ 15″ N 162° 03′ 42″ E',
  onChange,
  value: controlledValue,
  ...props
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

  useEffect(() => {
    if (typeof inputRef === 'function') {
      inputRef(innerRef.current)
    }
  }, [innerRef, inputRef])

  return (
    <input {...props} placeholder={placeholder} ref={innerRef} type="text" />
  )
}

CoordinateInput.propTypes = {
  degreeChar: PropTypes.string,
  ddPrecision: PropTypes.number,
  dmsPrecision: PropTypes.number,
  minuteChar: PropTypes.string,
  onChange: PropTypes.func.isRequired,
  placeholder: PropTypes.string,
  placeholderChar: PropTypes.string,
  inputRef: PropTypes.func,
  secondChar: PropTypes.string,
  spacerChar: PropTypes.string,
  value: PropTypes.string,
}

export default CoordinateInput
