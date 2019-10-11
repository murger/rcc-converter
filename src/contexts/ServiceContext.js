import React, { Component } from 'react'
import { getExchangeRates } from '../services/ExchangeService'

export const ServiceContext = React.createContext()
export const ServiceConsumer = ServiceContext.Consumer

const POLL_TIMEOUT = 1000 * 10
const ERROR_TIMEOUT = 1000 * 3.5

export class ServiceProvider extends Component {
  state = {
    base: 'GBP',
    rates: {},
    loading: true,
    error: false
  }

  componentDidMount () {
    this.fetchExchangeRates()
  }

  fetchExchangeRates = async () => {
    const { base } = this.state

    try {
      const data = await getExchangeRates(base)

      this.setState({
        rates: data.rates,
        loading: false
      })
    } catch (error) {
      this.setState({
        error: true,
        loading: false
      }, () => setTimeout(this.resetError, ERROR_TIMEOUT))
    }

    setTimeout(this.fetchExchangeRates, POLL_TIMEOUT)
  }

  resetError = () => {
    this.setState({ error: false })
  }

  getCurrencyRate = (source, target) => {
    const { rates, base } = this.state
    const rate = (source === base)
      ? rates[target]
      : rates[target] / rates[source]

    return Number(rate) || 0
  }

  render () {
    const { children } = this.props
    const { rates, loading, error } = this.state
    const { getCurrencyRate } = this

    return (
      <ServiceContext.Provider
        value={{
          rates,
          error,
          loading,
          getCurrencyRate
        }}>
        {children}
      </ServiceContext.Provider>
    )
  }
}
