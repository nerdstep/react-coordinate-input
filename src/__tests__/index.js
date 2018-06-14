import { configure, shallow } from 'enzyme'
import Adapter from 'enzyme-adapter-react-16'
import React from 'react'
import ReactDOM from 'react-dom'
import CoordinateInput from '../'

configure({ adapter: new Adapter() })

describe('CoordinateInput', () => {
  it('is truthy', () => {
    expect(CoordinateInput).toBeTruthy()
  })

  it('renders without crashing', () => {
    ReactDOM.render(<CoordinateInput />, document.createElement('div'))
  })

  it('should match the snapshot', () => {
    expect(shallow(<CoordinateInput />)).toMatchSnapshot()
    expect(shallow(<CoordinateInput dmsPrecision={3} />)).toMatchSnapshot()
    expect(
      shallow(
        <CoordinateInput
          degreeChar="D"
          minuteChar="M"
          secondChar="S"
          spacerChar="-"
        />
      )
    ).toMatchSnapshot()
  })

  it('should call the onChange handler with the converted results', () => {
    const value = '90 00 00.000 N 180 00 00.000 E'
    const arg1 = { target: { value } }
    const arg2 = {
      dd: [90, 180],
      dms: '90:00:00.000:N:180:00:00.000:E',
      dmsArray: [[90, 0, 0, 'N'], [180, 0, 0, 'E']],
    }
    const onChange = jest.fn()
    const wrapper = shallow(
      <CoordinateInput dmsPrecision={3} onChange={onChange} />
    )

    expect(wrapper).toMatchSnapshot()

    wrapper.simulate('change', {
      target: { value },
    })

    expect(onChange).toBeCalledWith(arg1, arg2)
  })

  it('should call the onChange handler with empty results', () => {
    const arg1 = { target: { value: '' } }
    const arg2 = {
      dd: [],
      dms: '',
      dmsArray: [],
    }
    const onChange = jest.fn()
    const wrapper = shallow(<CoordinateInput onChange={onChange} />)

    expect(wrapper).toMatchSnapshot()

    wrapper.simulate('change', {
      target: { value: '' },
    })

    expect(onChange).toBeCalledWith(arg1, arg2)
  })
})
