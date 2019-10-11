import React, { useContext, useReducer } from 'react'

import { ServiceContext } from '../../contexts/ServiceContext'
import Pane from '../Pane'
import paneReducer from './reducers/pane'
import pocketReducer from './reducers/pocket'

const POCKETS = [
  { currency: 'GBP', amount: 5000 },
  { currency: 'USD', amount: 0 },
  { currency: 'EUR', amount: 0 },
  { currency: 'JPY', amount: 0 }
]

const PANES = [
  { id: 'top', color: 'white', amount: null, activePocket: 0, target: 'bottom', autoFocus: true },
  { id: 'bottom', color: 'black', amount: null, activePocket: POCKETS.length - 1, target: 'top' }
]

const Converter = () => {
  const [panes, updatePane] = useReducer(paneReducer, PANES)
  const [pockets, updatePocket] = useReducer(pocketReducer, POCKETS)
  const { getCurrencyRate } = useContext(ServiceContext)

  const convertCurrency = (amount, pane, targetPane, isViable) => {
    const source = pockets[pane.activePocket]
    const target = pockets[targetPane.activePocket]
    const targetAmount = amount * getCurrencyRate(source.currency, target.currency)

    updatePane({ type: 'AMOUNT', amount: amount || null, id: pane.id })
    updatePane({ type: 'AMOUNT', amount: targetAmount || null, id: targetPane.id })

    if (isViable) {
      updatePocket({ type: 'WITHDRAW', amount: amount, currency: source.currency })
      updatePocket({ type: 'DEPOSIT', amount: targetAmount, currency: target.currency })
    }
  }

  return (
    <>
      {panes.map(pane =>
        <Pane
          key={pane.id}
          pane={pane}
          pockets={pockets}
          updatePane={updatePane}
          targetPane={panes.find(p => p.id === pane.target)}
          getCurrencyRate={getCurrencyRate}
          convertCurrency={convertCurrency}
        />
      )}
    </>
  )
}

export default Converter
