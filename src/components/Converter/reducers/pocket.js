const reducer = (state, { type, amount, currency }) => {
  switch (type) {
    case 'DEPOSIT':
      return state.map(pocket => (pocket.currency === currency)
        ? { ...pocket, amount: pocket.amount + amount }
        : pocket
      )
    case 'WITHDRAW':
      return state.map(pocket => (pocket.currency === currency)
        ? { ...pocket, amount: pocket.amount - amount }
        : pocket
      )
    default:
      return state
  }
}

export default reducer
