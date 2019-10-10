import { API_HOST, API_KEY } from '../constants'

export const getExchangeRates = async () => {
  const url = [API_HOST, `latest.json?app_id=${API_KEY}`].join('/')
  const response = await fetch(url)
  const json = await response.json()

  return json
}
