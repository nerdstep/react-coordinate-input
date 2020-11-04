// @ts-check
import IMask from 'imask/esm/imask'
import { useCallback, useEffect, useMemo, useRef } from 'react'
import { createMask } from './createMask'
import {
  convertInput,
  dmsToDecimal,
  normalizeInput,
  parseDMS,
  validateDMS,
} from './utils'

/**
 * useCoordMask Hook
 *
 * @param {Object} options
 * @property {ref} inputRef Input ref
 * @property {string} controlledValue Input value
 * @property {string} [degreeChar] Degrees symbol, e.g. `°`
 * @property {string} [minuteChar] Minutes symbol, e.g. `′`
 * @property {string} [secondChar] Seconds symbol, e.g. `″`
 * @property {string} [spacerChar] Spacer character, e.g. ` `
 * @property {string} [placeholderChar] Placeholder character, e.g. `_`
 * @property {number} [ddPrecision] Decimal places [0-8]
 * @property {number} [dmsPrecision] Decimal places [0-6]
 * @property {function} onChange onChange callback
 */
export const useCoordMask = ({
  inputRef,
  controlledValue,
  degreeChar,
  minuteChar,
  secondChar,
  spacerChar,
  placeholderChar,
  ddPrecision,
  dmsPrecision,
  onChange,
}) => {
  const maskRef = useRef(null)

  const mask = useMemo(
    () =>
      createMask({
        degreeChar,
        minuteChar,
        secondChar,
        spacerChar,
        placeholderChar,
        dmsPrecision,
      }),
    [
      degreeChar,
      minuteChar,
      secondChar,
      spacerChar,
      placeholderChar,
      dmsPrecision,
    ]
  )

  const handleChange = useCallback(
    (value, unmaskedValue) => {
      if (unmaskedValue.length) {
        const normalized = normalizeInput(value)
        const isValid = validateDMS(normalized)

        //console.log('handleChange', { value, unmaskedValue, isValid })

        if (isValid) {
          const dms = parseDMS(normalized)

          // @ts-ignore {https://github.com/Microsoft/TypeScript/pull/24897}
          const lat = dmsToDecimal(...dms[0], ddPrecision)
          // @ts-ignore
          const lon = dmsToDecimal(...dms[1], ddPrecision)

          // Callback with the original event and the converted values
          onChange(value, { unmaskedValue, dd: [lat, lon], dms })
        }
      } else {
        onChange('', { unmaskedValue: '', dd: [], dms: [] })
      }
    },
    [ddPrecision, onChange]
  )

  const initMask = useCallback(
    (element, mask) => {
      maskRef.current = IMask(element, mask)

      //console.log('initMask', { mask })

      maskRef.current.on('accept', () => {
        const { unmaskedValue } = maskRef.current
        //console.log('accept', unmaskedValue)
        if (unmaskedValue === '') {
          maskRef.current._fireEvent('complete')
        }
      })

      maskRef.current.on('complete', () => {
        const { unmaskedValue, value } = maskRef.current
        //console.log('complete', value, unmaskedValue)
        handleChange(value, unmaskedValue)
      })
    },
    [handleChange]
  )

  const setValue = useCallback(
    (value) => {
      // Convert DD value to DMS
      const dmsValue = convertInput(value, dmsPrecision, '')

      // Resolve new masked value
      mask.resolve(dmsValue)

      //console.log({ value, dmsValue })

      // Syncronize view from model value & fire change events
      maskRef.current.updateControl()
    },
    [dmsPrecision, mask]
  )

  // Initialize new IMask instance if it doesn't exist yet
  useEffect(() => {
    if (!maskRef.current) {
      initMask(inputRef.current, mask)
    }
  }, [initMask, inputRef, mask])

  // Update mask value when the input value changes
  useEffect(() => {
    //console.log('useEffect', { controlledValue })
    if (maskRef.current && inputRef.current?.value !== controlledValue) {
      setValue(controlledValue)
    }
  }, [controlledValue, inputRef, setValue])
}
