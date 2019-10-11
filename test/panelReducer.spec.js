import reducer from '../src/components/Converter/reducers/panel';

it('should return the initial state', () => {
  expect(reducer({}, {})).toEqual({})
})

it('should handle AMOUNT', () => {
  const panels = [
    { id: 'top', amount: null }
  ]

  const action = {
    type: 'AMOUNT',
    id: 'top',
    amount: 5
  }

  expect(reducer(panels, action)).toEqual([{ id: 'top', amount: 5 }])
})

it('should handle INDEX', () => {
  const panels = [
    { id: 'top', activePocket: 0 }
  ]

  const action = {
    type: 'INDEX',
    id: 'top',
    activePocket: 1
  }

  expect(reducer(panels, action)).toEqual([{ id: 'top', activePocket: 1 }])
})
