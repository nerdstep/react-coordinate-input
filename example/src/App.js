import React, { Component } from 'react'

import CoordinateInput from 'react-coordinate-input'

const repoName = 'nerdstep/react-coordinate-input'
const repoUrl = `https://github.com/${repoName}`

function fill(arr, value, count) {
  for (let i = 0; i < count; i++) {
    arr.push(value)
  }
  return arr
}

export default class App extends Component {
  constructor(props) {
    super()

    this.state = {
      dd: [],
      ddPrecision: 6,
      dms: '',
      dmsArray: [],
      dmsPrecision: 0,
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
    console.log(e.target.value, dd, dms, dmsArray)
    this.setState({ dd, dms, dmsArray })
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

  render() {
    const { ddPrecision, dd, dms, dmsPrecision } = this.state
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
                      key={dmsPrecision + ddPrecision}
                      onChange={this.handleChange}
                      placeholder={this.getPlaceholder()}
                      value={dms}
                    />
                  </div>
                </div>
                <h5>Options</h5>
                <div className="field">
                  <label className="label is-small has-text-grey">
                    Decimal Places for Seconds (0-6)
                  </label>
                  <div className="control">
                    <input
                      className="input is-small"
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
                      className="input is-small"
                      onChange={this.handleChangeDDPrecision}
                      type="number"
                      value={ddPrecision}
                    />
                  </div>
                </div>
                <div className="field">
                  <label className="label">Output - Decimal Degrees</label>
                  <div className="control">
                    <input
                      disabled
                      className="input"
                      type="text"
                      value={dd.join(', ')}
                    />
                  </div>
                </div>
              </div>

              <nav
                className="breadcrumb has-bullet-separator is-centered"
                aria-label="breadcrumbs"
              >
                <ul>
                  <li>
                    <a href={repoUrl}>GitHub</a>
                  </li>
                  <li>
                    <a href={repoUrl}>
                      <img
                        src={`https://img.shields.io/github/forks/${repoName}.svg?style=social&amp;label=Fork&amp;maxAge=2592000`}
                        alt="GitHub forks"
                      />
                    </a>
                  </li>
                  <li>
                    <a href={repoUrl}>
                      <img
                        src={`https://img.shields.io/github/stars/${repoName}.svg?style=social&amp;label=Stars&amp;maxAge=2592000`}
                        alt="GitHub stars"
                      />
                    </a>
                  </li>
                </ul>
              </nav>
            </div>
          </div>
        </div>
      </section>
    )
  }
}
