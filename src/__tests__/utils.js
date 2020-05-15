import {
  convertInput,
  decimalToDMS,
  dmsToDecimal,
  fill,
  normalizeInput,
  parseDMS,
  serializeDMS,
  validateDMS,
} from '../utils'
import data from '../__mocks__/data'

/**
 * Data format:
 * [
 *   [
 *     '<DMS>',
 *     '<normalizedDMS>',
 *     [[<D>, <M>, <S>, '<N|S>'], [<D>, <M>, <S>, '<E|W>']],
 *     [<latDD>, <lonDD>]
 *   ]
 * ]
 */

const dmsPrecision = 3

describe('fill', () => {
  it('should equal to xxx', () => {
    expect(fill([], 'x', 3)).toEqual(['x', 'x', 'x'])
  })
  it('should equal to xo', () => {
    expect(fill(['x'], 'o', 1)).toEqual(['x', 'o'])
  })
})

describe('normalizeInput', () => {
  it('should be empty', () => {
    expect(normalizeInput()).toBe('')
  })

  data.forEach((item) => {
    it(`${item[0]} -> ${item[1]}`, () => {
      expect(normalizeInput(item[0])).toBe(item[1])
    })
  })
})

describe('convertInput', () => {
  it(`${data[0][0]} -> ${data[0][0]}`, () => {
    expect(convertInput(data[0][0])).toBe(data[0][0])
  })

  data.forEach((item) => {
    it(`${item[3]} -> ${item[1]}`, () => {
      expect(convertInput(item[3].join(','), dmsPrecision)).toBe(item[1])
    })
  })
})

describe('validateDMS', () => {
  data.forEach((item) => {
    it(`${item[1]}`, () => {
      expect(validateDMS(item[1])).toBe(true)
    })
  })
})

describe('parseDMS', () => {
  data.forEach((item) => {
    it(`${item[1]} -> ${item[2]}`, () => {
      expect(parseDMS(item[1])).toEqual(item[2])
    })
  })
})

describe('serializeDMS', () => {
  data.forEach((item) => {
    it(`${item[2]} -> ${item[1]}`, () => {
      expect(serializeDMS(item[2][0], item[2][1])).toEqual(item[1])
    })
  })
})

describe('dmsToDecimal', () => {
  data.forEach((item) => {
    it(`Latitude: ${item[2][0]} -> ${item[3][0]}`, () => {
      expect(dmsToDecimal(...item[2][0])).toBe(item[3][0])
    })

    it(`Longitude: ${item[2][1]} -> ${item[3][1]}`, () => {
      expect(dmsToDecimal(...item[2][1])).toBe(item[3][1])
    })
  })
})

describe('decimalToDMS', () => {
  it('24.775196 -> 24° 46′ 31″N', () => {
    expect(decimalToDMS(24.775196, false)).toEqual([24, 46, 31, 'N'])
  })

  data.forEach((item) => {
    it(`Latitude: ${item[3][0]} -> ${item[2][0]}`, () => {
      expect(decimalToDMS(item[3][0], false, dmsPrecision)).toEqual(item[2][0])
    })

    it(`Longitude: ${item[3][1]} -> ${item[2][1]}`, () => {
      expect(decimalToDMS(item[3][1], true, dmsPrecision)).toEqual(item[2][1])
    })
  })
})
