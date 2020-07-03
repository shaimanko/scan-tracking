import React, { Component } from 'react'

import './style.scss'

class Home extends Component {
  constructor() {
    super()
    this.state = {
      tracks: [],
      scans: [],
      dropdownList: ['Normal', 'Carton', 'Frozen'],
      formData: {
        trackingNumber: '',
        parcelType: 'Normal',
        amount: '',
      },
    }
    this.fieldChange = this.fieldChange.bind(this)
    this.handleSubmit = this.handleSubmit.bind(this)
  }
  componentDidMount() {
    this.fetchData()
  }
  async fetchData() {
    const response = await fetch('/api/track')
    const body = await response.json()
    if (response.status !== 200) throw Error(body.message)
    this.setState({ tracks: body })
  }
  strSplit(str) {
    return str.slice(0, 4) + '-' + str.slice(4, 8) + '-' + str.slice(8, 12)
  }
  handleSubmit(e) {
    e.preventDefault()
    const { tracks, formData, scans } = this.state
    if (tracks.length > 0) {
      tracks.forEach((i, index) => {
        let trackId = formData.trackingNumber
        const splitTrackId = trackId.split('-')
        if (splitTrackId.length > 1) {
          trackId = ''
          splitTrackId.forEach((j) => {
            trackId += j
          })
        }
        if (i.trackId === trackId) {
          const newScan = {
            ...tracks[index],
            ...formData,
          }
          tracks.splice(index, 1)
          this.setState({
            tracks,
            scans: [...scans, newScan],
          })
          document.getElementById('tracking-form').reset()
        }
      })
    }
  }
  cancelAction(id) {
    const { tracks, scans } = this.state
    scans.forEach((i, index) => {
      if (i.id === id) {
        const cancelTrack = {
          ...scans[index],
        }
        scans.splice(index, 1)
        this.setState({
          tracks: [...tracks, cancelTrack],
        })
      }
    })
  }
  fieldChange(e) {
    const { formData } = this.state
    this.setState({
      formData: {
        ...formData,
        [e.target.name]: e.target.value,
      },
    })
  }
  render() {
    const { tracks, scans, dropdownList } = this.state

    return (
      <div className='scan-tracking-container container'>
        <h1>Scan Tracking</h1>
        <div className='tracking-container'>
          <div className='row'>
            <div className='col'>
              <div className='table-header alert'>
                Pending Tracking
                <span className='badge badge-pill badge-primary'>
                  {tracks.length}
                </span>
              </div>
              {tracks.length > 0 ? (
                tracks.map((i) => (
                  <div
                    className='table-content'
                    key={`pending-tracking-${i.id}`}
                  >
                    <div className='tracking-number'>
                      <b>{this.strSplit(i.trackId)}</b>
                    </div>
                    <div
                      className={`recieve-date${
                        i.recieveDay > 0 ? '' : ' none'
                      }`}
                    >
                      <span>
                        {i.recieveDay &&
                          (i.recieveDay > 1
                            ? `in ${i.recieveDay} days`
                            : `in ${i.recieveDay} day`)}
                      </span>
                    </div>
                    <div
                      className={`recieve-time${
                        i.recieveTime > 1 ? '' : ' none'
                      }`}
                    >
                      <span>
                        {i.recieveTime &&
                          (i.recieveTime > 0
                            ? `in ${i.recieveTime} hours`
                            : `in ${i.recieveTime} hour`)}
                      </span>
                    </div>
                    <div className='location'>{i.location}</div>
                    <div className='status'>{i.status}</div>
                  </div>
                ))
              ) : (
                <div className='table-content'>No item.</div>
              )}
            </div>
            <div className='col'>
              <form id='tracking-form'>
                <label>Tracking Number</label>
                <div className='input-group'>
                  <input
                    name='trackingNumber'
                    onChange={this.fieldChange}
                    type='text'
                    className='form-control'
                    placeholder='xxxx-xxxx-xxxx'
                    aria-label='xxxx-xxxx-xxxx'
                    aria-describedby='basic-addon1'
                  />
                </div>
                <label>Parcel Type</label>
                <div className='input-group'>
                  <select
                    onChange={this.fieldChange}
                    className='custom-select'
                    name='parcelType'
                  >
                    {dropdownList.length > 0 &&
                      dropdownList.map((i, index) => (
                        <option key={index} value={i}>
                          {i}
                        </option>
                      ))}
                  </select>
                </div>
                <label>Amount</label>
                <div className='input-group'>
                  <input
                    name='amount'
                    onChange={this.fieldChange}
                    type='text'
                    className='form-control'
                    placeholder='Amount'
                    aria-label='Amount'
                    aria-describedby='basic-addon1'
                  />
                </div>
                <button
                  onClick={this.handleSubmit}
                  className='btn btn-primary btn-block'
                >
                  Add To Scanned List
                </button>
              </form>
            </div>
            <div className='col'>
              <div className='table-header alert'>
                Scanned
                <span className='badge badge-pill badge-primary'>
                  {scans.length}
                </span>
              </div>
              {scans.length > 0 ? (
                scans.map((i) => (
                  <div className='table-content' key={`scan-tracking-${i.id}`}>
                    <div className='tracking-number'>
                      <b>{this.strSplit(i.trackId)}</b>
                    </div>
                    <button
                      type='button'
                      className='btn btn-danger'
                      onClick={() => this.cancelAction(i.id)}
                    >
                      Cancel
                    </button>
                    <div className='status'>{i.status}</div>
                    <button type='button' className='btn btn-outline-dark'>
                      {i.parcelType}
                    </button>
                    <button type='button' className='btn btn-outline-dark'>
                      {i.amount > 1 ? `${i.amount} items` : `${i.amount} item`}
                    </button>
                  </div>
                ))
              ) : (
                <div className='table-content'>No item.</div>
              )}
            </div>
          </div>
        </div>
      </div>
    )
  }
}

export default Home
