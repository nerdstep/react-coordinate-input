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
    outValue: '',
    result: {
      dd: [],
      dms: '',
      dmsArray: [],
    },
  },
  {
    testName: 'should have dmsPrecision 3',
    inputName: 'testInput',
    value: '90 00 00.000 N 180 00 00.000 E',
    outValue: '90° 00′ 00.000″ N 180° 00′ 00.000″ E',
    props: {
      dmsPrecision: 3,
    },
    result: {
      dd: [90, 180],
      dms: '90:00:00.000:N:180:00:00.000:E',
      dmsArray: [
        [90, 0, 0, 'N'],
        [180, 0, 0, 'E'],
      ],
    },
  },
  {
    testName: 'should have ddPrecision 8',
    inputName: 'testInput',
    value: '30 09 08 N 038 09 07 E',
    outValue: '30° 09′ 08″ N 038° 09′ 07″ E',
    props: {
      ddPrecision: 8,
    },
    result: {
      dd: [30.15222222, 38.15194444],
      dms: '30:09:08:N:038:09:07:E',
      dmsArray: [
        [30, 9, 8, 'N'],
        [38, 9, 7, 'E'],
      ],
    },
  },
]

testsValues.forEach(
  ({ testName, inputName, outValue, value, props = {}, result }) => {
    it(`${testName}`, () => {
      const event = { target: { value } }
      const onChange = jest.fn((e, value) => value)

      const { debug, getByLabelText } = render(
        <CoordinateInput {...props} name={inputName} onChange={onChange} />
      )

      //debug()

      const input = getByLabelText(inputName)

      fireEvent.change(input, event)

      expect(input).toBeInTheDocument()
      expect(input).toHaveAttribute('name', inputName)
      expect(input).toHaveValue(outValue)
      expect(onChange).toHaveReturnedWith(result)
      expect(onChange).toHaveBeenCalledTimes(1)
    })
  }
)

describe('CoordinateInput', () => {
  it('is truthy', () => {
    expect(CoordinateInput).toBeTruthy()
  })

  it('renders without crashing', () => {
    ReactDOM.render(<CoordinateInput />, document.createElement('div'))
  })
})
