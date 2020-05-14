import createMask from '../createMask'

describe('createMask', () => {
  it(`should equal`, () => {
    expect(createMask()).toEqual(
      'YDDCSPACERYMMCSPACERYSSCSPACERNSSPACERXDDCSPACERXMMCSPACERXSSCSPACEREW'
    )
  })

  it(`should equal`, () => {
    expect(createMask({ precision: 1 })).toEqual(
      'YDDCSPACERYMMCSPACERYSDOTASSCSPACERNSSPACERXDDCSPACERXMMCSPACERXSDOTASSCSPACEREW'
    )
  })
})
