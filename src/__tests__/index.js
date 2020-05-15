import '@testing-library/jest-dom'
import { fireEvent, render } from '@testing-library/react'
import React from 'react'
import ReactDOM from 'react-dom'
import CoordinateInput from '../'

const testsValues = [
  {
    testName: 'should call the onChange handler with empty results',
    inputName: 'testInput',
    value: ' ',
    result: {
      value: '',
      unmaskedValue: '',
      dd: [],
      dms: [],
    },
  },
  {
    testName: 'should have dmsPrecision 3',
    inputName: 'testInput',
    value: '90 00 00.000 N 180 00 00.000 E',
    props: {
      dmsPrecision: 3,
    },
    result: {
      value: '90° 00′ 00.000″ N 180° 00′ 00.000″ E',
      unmaskedValue: '900000000N1800000000E',
      dd: [90, 180],
      dms: [
        [90, 0, 0, 'N'],
        [180, 0, 0, 'E'],
      ],
    },
  },
  {
    testName: 'should have ddPrecision 8',
    inputName: 'testInput',
    value: '30 09 08 N 038 09 07 E',
    props: {
      ddPrecision: 8,
    },
    result: {
      value: '30° 09′ 08″ N 038° 09′ 07″ E',
      unmaskedValue: '300908N0380907E',
      dd: [30.15222222, 38.15194444],
      dms: [
        [30, 9, 8, 'N'],
        [38, 9, 7, 'E'],
      ],
    },
  },
]

testsValues.forEach(({ testName, inputName, value, props = {}, result }) => {
  it(`${testName}`, () => {
    const event = { target: { value } }
    const onChange = jest.fn((value, obj) => ({ value, ...obj }))

    const { /* debug, */ getByLabelText } = render(
      <CoordinateInput
        {...props}
        name={inputName}
        onChange={onChange}
        value={value}
      />
    )

    // debug()

    const input = getByLabelText(inputName)

    fireEvent.change(input, event)

    expect(input).toBeInTheDocument()
    expect(input).toHaveAttribute('name', inputName)
    expect(input).toHaveValue(value)
    expect(onChange).toHaveReturnedWith(result)
    expect(onChange).toHaveBeenCalledTimes(1)
  })
})

describe('CoordinateInput', () => {
  it('is truthy', () => {
    expect(CoordinateInput).toBeTruthy()
  })

  it('renders without crashing', () => {
    ReactDOM.render(
      <CoordinateInput onChange={() => {}} />,
      document.createElement('div')
    )
  })
})
