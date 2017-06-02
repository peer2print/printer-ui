import React, { Component } from 'react'
import ProductionList from "./ProductionList.js"
import setContractDefaults from "./setContractDefaults.js"
const loadContract = require("core").loadContract

function applyConstraints(Production, prodAddr, constraints, from)
{
	return (Production.at(prodAddr).then((production) => {
		if (constraints.buyer === undefined)
			return production
		else
			return (production.buyer().then((productionBuyer) => {
				if (constraints.buyer === true && from === productionBuyer)
					return production
				else if (from !== productionBuyer)
					return production
				else
					return null
			}))
	}))
}

function fetchProductions(registry, addProductions, from, constraints) {
	var Production = loadContract("Production")
	setContractDefaults(Production, {from: from})
	registry.getProductionsCount.call().then((size) => {
		var i = 0
		var prodAddrsPromises = []
		while (i < size)
			prodAddrsPromises.push(registry.productions.call(i++))
		return Promise.all(prodAddrsPromises).then((prodAddrs) => {
			var prodPromises = prodAddrs.map((prodAddr) => {
				if (constraints) {
					return (applyConstraints(Production, prodAddr, constraints, from))
				} else {
					return (Production.at(prodAddr))
				}
			})
			Promise.all(prodPromises).then((prods) => {
				addProductions(prods)
			})
		})
	})
}

export default class RegistryViewer extends Component {
	addProductions(prods) {
		this.setState({productionList: this.state.productionList.concat(prods)})
	}
	constructor(props) {
		super(props)
		this.state = {productionList: []}
		fetchProductions(this.props.registry, this.addProductions.bind(this),
				this.props.from, this.props.constraints)
	}
	render() {
		return <ProductionList productionList={this.state.productionList} />
	}
}
