import { useMemo } from 'react'
import createLatLongPipe from './createLatLongPipe'
import createMask from './createMask'
import { convertInput } from './utils'

export const useCoordMask = ({
  degreeChar = '°',
  minuteChar = '′',
  secondChar = '″',
  spacerChar = ' ',
  dmsPrecision = 0,
  value,
}) => {
  const mask = useMemo(
    () =>
      createMask({
        degree: degreeChar,
        minute: minuteChar,
        second: secondChar,
        space: spacerChar,
        precision: dmsPrecision,
      }),
    [degreeChar, minuteChar, secondChar, spacerChar, dmsPrecision]
  )

  const pipe = useMemo(() => createLatLongPipe(dmsPrecision), [dmsPrecision])

  const dmsValue = useMemo(() => convertInput(value, dmsPrecision), [
    dmsPrecision,
    value,
  ])

  return { mask, pipe, value: dmsValue }
}
