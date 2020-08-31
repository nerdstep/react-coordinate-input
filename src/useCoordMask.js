// @ts-check
import IMask from 'imask/esm/imask'
import { useCallback, useEffect, useMemo, useRef } from 'react'
import { createDDMask } from './createDDMask'
import { createDMSMask } from './createDMSMask'
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
 * @param {object} options
 * @property {object|null} [inputRef] Input ref
 * @property {number} [controlledValue] Input value
 * @property {string} [format] Mask format <dms|dd>
 * @property {string} [degreeChar] Degrees symbol, e.g. `°`
 * @property {string} [minuteChar] Minutes symbol, e.g. `′`
 * @property {string} [secondChar] Seconds symbol, e.g. `″`
 * @property {string} [spacerChar] Spacer character, e.g. ` `
 * @property {string} [placeholderChar] Placeholder character, e.g. `_`
 * @property {number} [dmsPrecision] Decimal places [0-6]
 * @property {string} value Input value
 * @returns {object}
 */
export const useCoordMask = ({
  inputRef,
  controlledValue,
  format,
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
      format === 'dd'
        ? createDDMask({ spacerChar, placeholderChar, ddPrecision })
        : createDMSMask({
            degreeChar,
            minuteChar,
            secondChar,
            spacerChar,
            placeholderChar,
            dmsPrecision,
          }),
    [
      format,
      degreeChar,
      minuteChar,
      secondChar,
      spacerChar,
      placeholderChar,
      ddPrecision,
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
      if (maskRef.current) maskRef.current.destroy()

      maskRef.current = IMask(element, mask)

      //console.log('initMask', maskRef.current)

      //maskRef.current.on('accept', () => {
      //console.log('accept')
      //})

      maskRef.current.on('complete', () => {
        const { unmaskedValue, value } = maskRef.current
        handleChange(value, unmaskedValue)
      })
    },
    [handleChange]
  )

  useEffect(() => {
    if (inputRef.current && inputRef.current.value !== controlledValue) {
      const dmsValue = convertInput(controlledValue, dmsPrecision, '')
      const maskedValue = mask.resolve(dmsValue)

      //console.log({ controlledValue, dmsValue, maskedValue, mask })

      if (controlledValue !== maskedValue) {
        inputRef.current.value = maskedValue
        initMask(inputRef.current, mask)
        handleChange(maskedValue, mask.unmaskedValue)
      }
    }
  }, [controlledValue, dmsPrecision, handleChange, initMask, inputRef, mask])

  useEffect(() => {
    if (!maskRef.current) {
      initMask(inputRef.current, mask)
    }
  }, [controlledValue, initMask, inputRef, mask])
}
