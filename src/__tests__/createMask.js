import { createMask } from '../createMask'

describe('createMask', () => {
  it(`should equal`, () => {
    expect(createMask().mask).toEqual(
      'YDDCSPACERYMMCSPACERYSSCSPACERNSSPACERXDDCSPACERXMMCSPACERXSSCSPACEREW'
    )
  })

  it(`should equal`, () => {
    expect(createMask({ dmsPrecision: 1 }).mask).toEqual(
      'YDDCSPACERYMMCSPACERYSDOTASSCSPACERNSSPACERXDDCSPACERXMMCSPACERXSDOTASSCSPACEREW'
    )
  })
})
