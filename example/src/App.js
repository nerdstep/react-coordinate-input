import React, { Component } from 'react'
import CoordinateInput from 'react-coordinate-input'
import Footer from './Footer'

function fill(arr, value, count) {
  for (let i = 0; i < count; i++) {
    arr.push(value)
  }
  return arr
}

export default class App extends Component {
  constructor(props) {
    super(props)

    this.state = {
      dd: [],
      ddPrecision: 6,
      defaultValue: '90, -180',
      dms: '',
      dmsArray: [],
      dmsPrecision: 0,
      showMask: false,
      value: '',
    }
  }

  getPlaceholder = () => {
    const { dmsPrecision } = this.state
    let p = '04° 08′ 15.dec″ N 162° 03′ 42.dec″ E'
    let dec = ''
    if (dmsPrecision > 0) {
      dec = fill([], 0, dmsPrecision).join('')
      dec = `.${dec}`
    }
    return p.replace(/\.dec/g, dec)
  }

  handleChange = (e, { dd, dms, dmsArray }) => {
    console.log('onChange', { value: e.target.value, dd, dms, dmsArray })
    this.setState({ dd, dms, dmsArray, value: dd.join(',') })
  }

  handleChangeDDPrecision = e => {
    let value = parseInt(e.target.value, 10) || 0
    value = value < 0 ? 0 : value > 8 ? 8 : value
    this.setState({ ddPrecision: value })
  }

  handleChangeDMSPrecision = e => {
    let value = parseInt(e.target.value, 10) || 0
    value = value < 0 ? 0 : value > 6 ? 6 : value
    this.setState({ dmsPrecision: value })
  }

  handleReset = () => {
    this.setState({ value: '' })
  }

  handleSetValue = () => {
    this.setState({ value: this.state.defaultValue })
  }

  render() {
    const {
      ddPrecision,
      dd,
      defaultValue,
      dmsPrecision,
      showMask,
      value,
    } = this.state
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
                  <label className="label">
                    Input - Degrees Minutes Seconds
                  </label>
                  <div className="control">
                    <CoordinateInput
                      className="input"
                      ddPrecision={ddPrecision}
                      dmsPrecision={dmsPrecision}
                      onChange={this.handleChange}
                      placeholder={this.getPlaceholder()}
                      showMask={showMask}
                      value={value}
                    />
                  </div>
                </div>
                <div className="field is-grouped">
                  <div className="control">
                    <button className="button" onClick={this.handleSetValue}>
                      Set value to&nbsp;
                      <span className="tag is-dark">{defaultValue}</span>
                    </button>
                  </div>
                  <div className="control">
                    <button className="button" onClick={this.handleReset}>
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
                      onChange={this.handleChangeDMSPrecision}
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
                      onChange={this.handleChangeDDPrecision}
                      type="number"
                      value={ddPrecision}
                    />
                  </div>
                </div>
                <div className="field">
                  <label className="label">Output - Decimal Degrees</label>
                  <div className="control">
                    <input disabled className="input" type="text" value={dd} />
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
}
