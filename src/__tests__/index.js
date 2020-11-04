import '@testing-library/jest-dom'
import { render } from '@testing-library/react'
import React from 'react'
import ReactDOM from 'react-dom'
import { isDOMComponent } from 'react-dom/test-utils'
import CoordinateInput from '../'

const testsValues = [
  {
    testName: 'should convert decimal degress',
    inputName: 'testInput',
    initialValue: '__° __′ __″ _ ___° __′ __″ _',
    changeValue: '90, -90',
    resultValue: '90° 00′ 00″ N 090° 00′ 00″ W',
    result: {
      dd: [90, -90],
      dms: [
        [90, 0, 0, 'N'],
        [90, 0, 0, 'W'],
      ],
      unmaskedValue: '900000N0900000W',
      value: '90° 00′ 00″ N 090° 00′ 00″ W',
    },
  },
  {
    testName: 'should have dmsPrecision 3',
    inputName: 'testInput',
    initialValue: '__° __′ __.___″ _ ___° __′ __.___″ _',
    changeValue: '90 00 00.000 N 180 00 00.000 E',
    resultValue: '90° 00′ 00.000″ N 180° 00′ 00.000″ E',
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
    initialValue: '__° __′ __″ _ ___° __′ __″ _',
    changeValue: '30 09 08 N 038 09 07 E',
    resultValue: '30° 09′ 08″ N 038° 09′ 07″ E',
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

testsValues.forEach(
  ({
    testName,
    inputName,
    initialValue,
    changeValue,
    resultValue,
    props = {},
    result,
  }) => {
    it(`${testName}`, () => {
      const onChange = jest.fn((value, obj) => ({ value, ...obj }))

      const { /*debug,*/ getByLabelText, rerender } = render(
        <CoordinateInput
          {...props}
          aria-label={inputName}
          name={inputName}
          onChange={onChange}
          value={initialValue}
        />
      )

      const input = getByLabelText(inputName)
      //debug(input)

      expect(input).toBeInTheDocument()
      expect(input).toHaveAttribute('name', inputName)
      expect(input).toHaveValue(initialValue)

      rerender(
        <CoordinateInput
          {...props}
          aria-label={inputName}
          name={inputName}
          onChange={onChange}
          value={changeValue}
        />
      )

      expect(input).toHaveValue(resultValue)
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
    ReactDOM.render(
      <CoordinateInput onChange={() => {}} />,
      document.createElement('div')
    )
  })

  it('should callback with a ref to the input', () => {
    const inputRef = jest.fn((ref) => {
      expect(isDOMComponent(ref)).toBe(true)
    })

    render(<CoordinateInput inputRef={inputRef} onChange={() => {}} />)
    expect(inputRef).toHaveBeenCalledTimes(1)
  })

  it('should not call the onChange handler', () => {
    const onChange = jest.fn((value, obj) => ({ value, ...obj }))

    const { /*debug,*/ getByLabelText, rerender } = render(
      <CoordinateInput aria-label="testInput" onChange={onChange} />
    )

    const input = getByLabelText('testInput')
    //debug(input)

    expect(input).toBeInTheDocument()

    rerender(
      <CoordinateInput aria-label="testInput" onChange={onChange} value=" " />
    )

    expect(input).toHaveValue('__° __′ __″ _ ___° __′ __″ _')
    expect(onChange).toHaveBeenCalledTimes(0)
  })

  it('should call the onChange handler with empty results', () => {
    const onChange = jest.fn((value, obj) => ({ value, ...obj }))

    const { /*debug,*/ getByLabelText, rerender } = render(
      <CoordinateInput
        aria-label="testInput"
        onChange={onChange}
        value="90, 90"
      />
    )

    const input = getByLabelText('testInput')
    //debug(input)

    expect(input).toBeInTheDocument()

    rerender(
      <CoordinateInput aria-label="testInput" onChange={onChange} value="" />
    )

    expect(input).toHaveValue('__° __′ __″ _ ___° __′ __″ _')
    expect(onChange).toHaveReturnedWith({
      value: '',
      unmaskedValue: '',
      dd: [],
      dms: [],
    })
    expect(onChange).toHaveBeenCalledTimes(2)
  })
})
