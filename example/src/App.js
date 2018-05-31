import React, { Component } from 'react'

import CoordinateInput from 'react-coordinate-input'

export default class App extends Component {
  constructor(props) {
    super()

    this.state = {
      dms: '',
      dd: [],
    }
  }

  handleChange = (e, { dd, dms }) => {
    this.setState({ dms, dd })
  }

  render() {
    const { dms, dd } = this.state
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
                      onChange={this.handleChange}
                      value={dms}
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
              <p className="has-text-grey has-text-centered">
                <a href="https://github.com/nerdstep/react-coordinate-input">
                  GitHub
                </a>
              </p>
            </div>
          </div>
        </div>
      </section>
    )
  }
}
