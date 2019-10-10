import React, { useContext, useState, useReducer } from 'react'

import { ServiceContext } from '../../contexts/ServiceContext'
import Pane from '../Pane'

let POCKETS = [
  { currency: 'GBP', amount: 1000 },
  { currency: 'USD', amount: 0 },
  { currency: 'EUR', amount: 0 }
]

const Converter = () => {
  const service = useContext(ServiceContext);
  const [targetAmount, setTargetAmount] = useState(0)

  const [pockets, dispatch] = useReducer((state, { type, amount, currency }) => {
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
  }, POCKETS)

  const sourceIndex = 0
  const targetIndex = pockets.length - 1

  const convertCurrency = (amount, currency, isEnter) => {
    const targetPocket = pockets[targetIndex]
    const targetCurrency = targetPocket.currency
    const targetRate = service.getCurrencyRate(currency, targetCurrency)
    const targetAmount = amount * targetRate

    setTargetAmount(!isNaN(targetAmount) ? targetAmount : 0)

    if (isEnter) {
      dispatch({ type: 'WITHDRAW', amount, currency })
      dispatch({ type: 'DEPOSIT', amount: targetAmount, currency: targetCurrency })
    }
  }

  return (
    <>
      <Pane pockets={pockets} activeIndex={sourceIndex} convertCurrency={convertCurrency} isSource />
      <Pane pockets={pockets} activeIndex={targetIndex} calculatedAmount={targetAmount} />
    </>
  )
}

export default Converter
