import createLatLongPipe from '../createLatLongPipe'

describe('createLatLongPipe', () => {
  it(`should be false`, () => {
    const pipe = createLatLongPipe()
    expect(pipe('99')).toBe(false)
  })

  it(`should be false`, () => {
    const pipe = createLatLongPipe()
    expect(pipe('90° 10′ 00.000″ N 180° 00′ 00.000″ W')).toBe(false)
  })

  it(`should equal`, () => {
    const pipe = createLatLongPipe(3)
    expect(pipe('90° 00′ 00.000″ N 180° 00′ 00.000″ W')).toEqual({
      indexesOfPipedChars: [],
      value: '90° 00′ 00.000″ N 180° 00′ 00.000″ W',
    })
  })
})
