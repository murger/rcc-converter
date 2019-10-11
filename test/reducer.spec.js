import reducer from '../src/components/Converter/reducer';

describe('reducer', () => {
  it('should return the initial state', () => {
    expect(reducer({}, {})).toEqual({})
  })

  it('should handle WITHDRAW', () => {
    const pockets = [
      { currency: 'USD', amount: 20 }
    ]

    const action = {
      type: 'WITHDRAW',
      currency: 'USD',
      amount: 5
    }

    expect(reducer(pockets, action)).toEqual([{ 'amount': 15, 'currency': 'USD' }])
  })

  it('should handle DEPOSIT', () => {
    const pockets = [
      { currency: 'USD', amount: 20 }
    ]

    const action = {
      type: 'DEPOSIT',
      currency: 'USD',
      amount: 5
    }

    expect(reducer(pockets, action)).toEqual([{ 'amount': 25, 'currency': 'USD' }])
  })
});
