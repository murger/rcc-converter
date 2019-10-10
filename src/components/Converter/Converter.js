import React, { useContext, useState, useReducer } from 'react'

import { ServiceContext } from '../../contexts/ServiceContext'
import Pane from '../Pane'

let POCKETS = [
  { currency: 'GBP', amount: 1000 },
  { currency: 'USD', amount: 0 },
  { currency: 'EUR', amount: 0 }
]

const Converter = () => {
  const service = useContext(ServiceContext)
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

  const [sourceAmount, setSourceAmount] = useState(null)
  const [targetAmount, setTargetAmount] = useState(null)

  const [sourceIndex, setSourceIndex] = useState(0)
  const [targetIndex, setTargetIndex] = useState(pockets.length - 1)

  const convertCurrency = (fromAmount, fromCurrency, isSource, isViable) => {
    const toCurrency = pockets[isSource ? targetIndex : sourceIndex].currency
    const toRate = service.getCurrencyRate(fromCurrency, toCurrency)
    const toAmount = fromAmount * toRate

    if (isSource) {
      setTargetAmount(!isNaN(toAmount) && toAmount > 0 ? toAmount : null)
    } else {
      setSourceAmount(!isNaN(toAmount) && toAmount > 0 ? toAmount : null)
    }

    if (isViable) {
      dispatch({ type: 'WITHDRAW', amount: fromAmount, currency: fromCurrency })
      dispatch({ type: 'DEPOSIT', amount: toAmount, currency: toCurrency })
    }
  }

  return (
    <>
      <Pane
        pockets={pockets}
        activeIndex={sourceIndex}
        setIndex={setSourceIndex}
        convertCurrency={convertCurrency}
        calculatedAmount={sourceAmount}
        setAmount={setSourceAmount}
        isSource
      />
      <Pane
        pockets={pockets}
        activeIndex={targetIndex}
        setIndex={setTargetIndex}
        convertCurrency={convertCurrency}
        calculatedAmount={targetAmount}
        setAmount={setTargetAmount}
      />
    </>
  )
}

export default Converter
