import { ServiceProvider } from '../src/contexts/ServiceContext';

const context = new ServiceProvider()
const initialState = { base: 'GBP', rates: {}, loading: true, error: false }

it('should return the initial state', () => {
  expect(context.state).toEqual(initialState)
})

it('should convert rates correctly', () => {
  context.state = {
    ...initialState,
    rates: { 'USD': 1.2 }
  }

  expect(context.getCurrencyRate('GBP', 'USD')).toEqual(1.2)
})

it('should cross convert rates correctly', () => {
  context.state = {
    ...initialState,
    rates: { 'USD': 1.2, 'JPY': 2.4 }
  }

  expect(context.getCurrencyRate('USD', 'JPY')).toEqual(2)
})
