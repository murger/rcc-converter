import React, { Component } from 'react'
import { getExchangeRates } from '../services/ExchangeService'

export const ServiceContext = React.createContext()
export const ServiceConsumer = ServiceContext.Consumer

const ERROR_TIMEOUT = 1000 * 3.5

export class ServiceProvider extends Component {
  state = {
    data: [],
    loading: true,
    error: false
  }

  componentDidMount () {
    this.fetchExchangeRates()
  }

  fetchExchangeRates = async () => {
    this.setState({ loading: true })

    try {
      const data = await getExchangeRates()

      this.setState({
        data,
        loading: false
      })
    } catch (error) {
      this.setState({
        error: true,
        loading: false
      }, () => setTimeout(this.resetError, ERROR_TIMEOUT))
    }
  }

  resetError = () => {
    this.setState({ error: false })
  }

  getCurrencyRate = (currencyCode) => {
    const { data } = this.state

    return data.rates.find(c => c.id === currencyCode)
  }

  render () {
    const { children } = this.props
    const { data, loading, error } = this.state
    const { getCurrencyRate } = this

    return (
      <ServiceContext.Provider
        value={{
          data,
          error,
          loading,
          getCurrencyRate
        }}>
        {children}
      </ServiceContext.Provider>
    )
  }
}
