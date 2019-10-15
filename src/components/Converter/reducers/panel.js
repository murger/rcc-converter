const reducer = (state, { type, amount, pocketIndex, id }) => {
  switch (type) {
    case 'AMOUNT':
      return state.map(pane => (pane.id === id)
        ? { ...pane, amount }
        : pane
      )
    case 'INDEX':
      return state.map(pane => (pane.id === id)
        ? { ...pane, pocketIndex }
        : pane
      )
    default:
      return state
  }
}

export default reducer
