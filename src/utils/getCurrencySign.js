import currencies from '../translations/currencies.json'

export default (key) => currencies[key] ? currencies[key] : key
