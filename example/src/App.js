import React, { useCallback, useMemo, useRef, useState } from 'react'
import CoordinateInput from 'react-coordinate-input'
import Footer from './Footer'

function fill(arr, value, count) {
  for (let i = 0; i < count; i++) {
    arr.push(value)
  }
  return arr
}

const initialState = {
  dd: [],
  dms: '',
  dmsArray: [],
}

const App = () => {
  const [ddPrecision, setDDPrecision] = useState(6)
  const [dmsPrecision, setDMSPrecision] = useState(0)
  const [state, setState] = useState(initialState)
  const [value, setValue] = useState('')
  const inputRef = useRef()

  const placeholder = useMemo(() => {
    let p = '04° 08′ 15.dec″ N 162° 03′ 42.dec″ E'
    let dec = ''
    if (dmsPrecision > 0) {
      dec = fill([], 0, dmsPrecision).join('')
      dec = `.${dec}`
    }
    return p.replace(/\.dec/g, dec)
  }, [dmsPrecision])

  const handleReset = useCallback(() => {
    setState(initialState)
    setValue('')
  }, [])

  const handleChange = useCallback((e, { dd, dms, dmsArray }) => {
    setState({ dd, dms, dmsArray })
    setValue(dd.join(','))
  }, [])

  const handleBlur = useCallback(e => {
    //console.log('handleBlur', e)
  }, [])

  const handleChangeDDPrecision = useCallback(
    e => {
      handleReset()
      let value = parseInt(e.target.value, 10) || 0
      value = value < 0 ? 0 : value > 8 ? 8 : value
      setDDPrecision(value)
    },
    [handleReset]
  )

  const handleChangeDMSPrecision = useCallback(
    e => {
      handleReset()
      let value = parseInt(e.target.value, 10) || 0
      value = value < 0 ? 0 : value > 6 ? 6 : value
      setDMSPrecision(value)
    },
    [handleReset]
  )

  const handleSelectChange = useCallback(e => {
    setValue(e.target.value)
  }, [])

  return (
    <section className="hero is-fullheight has-background-light">
      <div className="hero-body">
        <div className="container">
          <div className="column is-6 is-offset-3">
            <h3 className="title has-text-grey has-text-centered">
              React Coordinate Input
            </h3>
            <div className="box">
              <div className="field">
                <label className="label">Input - Degrees Minutes Seconds</label>
                <div className="control">
                  <CoordinateInput
                    className="input"
                    ddPrecision={ddPrecision}
                    dmsPrecision={dmsPrecision}
                    inputProps={{ id: 'react-coord-input' }}
                    inputRef={c => (inputRef.current = c)}
                    onBlur={handleBlur}
                    onChange={handleChange}
                    placeholder={placeholder}
                    value={value}
                  />
                </div>
              </div>
              <div className="field is-grouped">
                <div className="control">
                  <div className="select">
                    <select onChange={handleSelectChange} value={value}>
                      <option value="">Set value...</option>
                      <option>90, -180</option>
                      <option>-90, 180</option>
                      <option>42.363, 27.891</option>
                      <option>422700N 0670600W</option>
                    </select>
                  </div>
                </div>
                <div className="control">
                  <button className="button" onClick={handleReset}>
                    Clear
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
                <label className="label">Output</label>
                <div className="control">
                  <pre>{JSON.stringify(state, null, 2)}</pre>
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
