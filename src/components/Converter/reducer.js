const reducer = (state, { type, amount, currency }) => {
  switch (type) {
    case 'DEPOSIT':
      return state.map(pocket => {
        if (pocket.currency === currency) {
          return { ...pocket, amount: pocket.amount + amount }
        } else {
          return pocket
        }
      })
    case 'WITHDRAW':
      return state.map(pocket => {
        if (pocket.currency === currency) {
          return { ...pocket, amount: pocket.amount - amount }
        } else {
          return pocket
        }
      })
    default:
      return state
  }
}

export default reducer
