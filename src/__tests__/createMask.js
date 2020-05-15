import { createMask } from '../createMask'

const p0 =
  'YDDCSPACERYMMCSPACERYSSCSPACERNSSPACERXDDCSPACERXMMCSPACERXSSCSPACEREW'
const p1 =
  'YDDCSPACERYMMCSPACERYSDOTASSCSPACERNSSPACERXDDCSPACERXMMCSPACERXSDOTASSCSPACEREW'

describe('createMask', () => {
  it('mask should not have a precision', () => {
    expect(createMask().mask).toEqual(p0)
    expect(createMask({ dmsPrecision: -1 }).mask).toEqual(p0)
  })

  it('mask should have a precision', () => {
    expect(createMask({ dmsPrecision: 1 }).mask).toEqual(p1)
    expect(createMask({ dmsPrecision: 7 }).mask).toEqual(p1)
  })
})
