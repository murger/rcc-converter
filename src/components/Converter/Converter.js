import React, { useContext, useReducer, useMemo } from 'react'

import { ServiceContext } from '../../contexts/ServiceContext'
import Panel from '../Panel'
import panelReducer from './reducers/panel'
import pocketReducer from './reducers/pocket'

const POCKETS = [
  { currency: 'GBP', amount: 5000 },
  { currency: 'USD', amount: 0 },
  { currency: 'EUR', amount: 0 },
  { currency: 'JPY', amount: 0 }
]

const PANELS = [
  { id: 'top', color: 'white', amount: null, activePocket: 0, target: 'bottom', autoFocus: true },
  { id: 'bottom', color: 'black', amount: null, activePocket: POCKETS.length - 1, target: 'top' }
]

const Converter = () => {
  const [panels, updatePanel] = useReducer(panelReducer, PANELS)
  const [pockets, updatePocket] = useReducer(pocketReducer, POCKETS)

  const { getCurrencyRate } = useContext(ServiceContext)

  const convertCurrency = (amount, panel, targetPanel, isViable) => {
    const source = pockets[panel.activePocket]
    const target = pockets[targetPanel.activePocket]
    const targetAmount = amount * getCurrencyRate(source.currency, target.currency)

    updatePanel({ type: 'AMOUNT', amount: amount || null, id: panel.id })
    updatePanel({ type: 'AMOUNT', amount: targetAmount || null, id: targetPanel.id })

    if (isViable) {
      updatePocket({ type: 'WITHDRAW', amount: amount, currency: source.currency })
      updatePocket({ type: 'DEPOSIT', amount: targetAmount, currency: target.currency })
    }
  }

  return useMemo(() => (
    <>
      {panels.map(panel =>
        <Panel
          key={panel.id}
          panel={panel}
          pockets={pockets}
          updatePanel={updatePanel}
          targetPanel={panels.find(p => p.id === panel.target)}
          getCurrencyRate={getCurrencyRate}
          convertCurrency={convertCurrency}
        />
      )}
    </>
  ), [panels, pockets])
}

export default Converter
