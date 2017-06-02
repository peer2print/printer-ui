import React, { Component } from 'react'

import Balance from './Balance.js'

export default class Login extends Component {
	constructor(props) {
		super(props)
		this.state = {address: ""}
		this.handleChange = this.handleChange.bind(this)
		this.setAddress = this.setAddress.bind(this)
	}
	render() { return (
		<form onSubmit={this.setAddress}>
          <label>
            Address:
            <input type="text" name="address" value={this.state.address} onChange={this.handleChange} />
          </label>
  		  <br />
          <input type="submit" value="Set Address" />
		  {this.state.address && <Balance address={this.state.address} />}
        </form>
    )}
	setAddress(event) {
		event.preventDefault()
		this.props.setAddress(this.state.address)
	}
	handleChange(event) {
		this.setState({[event.target.name]: event.target.value});
	}
}
