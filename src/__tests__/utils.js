import { decimalToDMS, parseDMS } from '../utils'

const pairs = [
  [90, '90.00.00N'],
  [-90, '90.00.00S'],
  [30.263888889, '30.15.50N'],
]

/*describe('dmsToDecimal', () => {
  pairs.forEach(item => {
    const dms = parseDMS(item[1])

    it(`${item[1]} -> ${item[0]}`, () => {
      expect(dmsToDecimal(dms)).toBe(item[0])
    })
  })
})*/

describe('decimalToDMS', () => {
  pairs.forEach(item =>
    it(`${item[0]} -> ${item[1]}`, () => {
      expect(decimalToDMS(item[0], item[2])).toBe(item[1])
    })
  )
})
