import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import CoordinateInput from 'react-coordinate-input'
import Footer from './Footer'

function fill(arr, value, count) {
  for (let i = 0; i < count; i++) {
    arr.push(value)
  }
  return arr
}

const initialState = {
  value: '',
  unmaskedValue: '',
  dd: [],
  dms: [],
}

const selectOptions = [
  '90, -180',
  '-90, 180',
  '42.363, 27.891',
  '42 27 00 N 067 06 00 W',
]

const App = () => {
  const [ddPrecision, setDDPrecision] = useState(6)
  const [dmsPrecision, setDMSPrecision] = useState(0)
  const [selected, setSelected] = useState('')
  const [state, setState] = useState(initialState)
  const inputRef = useRef()

  const placeholder = useMemo(() => {
    const p = '04° 08′ 15.dec″ N 162° 03′ 42.dec″ E'
    let dec = ''
    if (dmsPrecision > 0) {
      dec = fill([], 0, dmsPrecision).join('')
      dec = `.${dec}`
    }
    return p.replace(/\.dec/g, dec)
  }, [dmsPrecision])

  const handleReset = useCallback(() => {
    setState(initialState)
    setSelected('')
  }, [])

  const handleChange = useCallback((value, props) => {
    console.log('handleChange', { value, ...props })
    setState({ value, ...props })
  }, [])

  const handleBlur = useCallback((e) => {
    //console.log('handleBlur', e)
  }, [])

  const handleChangeDDPrecision = useCallback(
    (e) => {
      handleReset()
      let value = parseInt(e.target.value, 10) || 0
      value = value < 0 ? 0 : value > 8 ? 8 : value
      setDDPrecision(value)
    },
    [handleReset]
  )

  const handleChangeDMSPrecision = useCallback(
    (e) => {
      handleReset()
      let value = parseInt(e.target.value, 10) || 0
      value = value < 0 ? 0 : value > 6 ? 6 : value
      setDMSPrecision(value)
    },
    [handleReset]
  )

  const handleSelectChange = useCallback(({ target: { value } }) => {
    setSelected(value)
    setState({ value })
  }, [])

  useEffect(() => {
    //console.log(inputRef.current)
  }, [])

  const output = {
    ...state,
    dms: JSON.stringify(state.dms),
    dd: JSON.stringify(state.dd),
  }

  return (
    <section className="hero is-fullheight has-background-light">
      <div className="hero-body">
        <div className="container">
          <div className="column is-8 is-offset-2">
            <h3 className="title has-text-grey has-text-centered">
              React Coordinate Input
            </h3>
            <div className="box">
              <div className="field">
                <label className="label">Input - Degrees Minutes Seconds</label>
                <div className="control">
                  <CoordinateInput
                    aria-label="coordinate-input"
                    className="input"
                    dir="auto"
                    ddPrecision={ddPrecision}
                    dmsPrecision={dmsPrecision}
                    inputRef={(c) => (inputRef.current = c)}
                    name="coordinate-input"
                    onBlur={handleBlur}
                    onChange={handleChange}
                    placeholder={placeholder}
                    placeholderChar="_"
                    value={state.value}
                  />
                </div>
                <p className="help">Example: {placeholder}</p>
              </div>
              <div className="field is-grouped">
                <div className="control">
                  <div className="select">
                    <select
                      disabled={dmsPrecision > 0}
                      onChange={handleSelectChange}
                      value={selected}
                    >
                      <option value="">Set value...</option>
                      {selectOptions.map((el, i) => (
                        <option key={i}>{el}</option>
                      ))}
                    </select>
                  </div>
                </div>
                <div className="control">
                  <button className="button" onClick={handleReset}>
                    Reset
                  </button>
                </div>
              </div>
              <h5>Options</h5>
              <div className="field">
                <label className="label is-small has-text-grey">
                  Decimal Places for Seconds (0-6)
                </label>
                <div className="control">
                  <input
                    className="input"
                    onChange={handleChangeDMSPrecision}
                    type="number"
                    value={dmsPrecision}
                  />
                </div>
              </div>
              <div className="field">
                <label className="label is-small has-text-grey">
                  Decimal Places for Decimal Degrees (0-8)
                </label>
                <div className="control">
                  <input
                    className="input"
                    onChange={handleChangeDDPrecision}
                    type="number"
                    value={ddPrecision}
                  />
                </div>
              </div>
              <div className="field">
                <label className="label">State</label>
                <div className="control">
                  <pre>{JSON.stringify(output, null, 2)}</pre>
                </div>
              </div>
            </div>
            <Footer />
          </div>
        </div>
      </div>
    </section>
  )
}

export default App
