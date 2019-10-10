import { API_HOST } from '../constants'

export const getExchangeRates = async (base) => {
  const url = [API_HOST, `latest?base=${base}`].join('/')
  const response = await fetch(url, { mode: 'cors' })
  const json = await response.json()

  return json
}
