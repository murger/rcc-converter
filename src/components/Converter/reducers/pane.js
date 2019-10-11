const reducer = (state, { type, amount, activePocket, id }) => {
  switch (type) {
    case 'AMOUNT':
      return state.map(pane => {
        if (pane.id === id) {
          return { ...pane, amount }
        } else {
          return pane
        }
      })
    case 'INDEX':
      return state.map(pane => {
        if (pane.id === id) {
          return { ...pane, activePocket }
        } else {
          return pane
        }
      })
    default:
      return state
  }
}

export default reducer
