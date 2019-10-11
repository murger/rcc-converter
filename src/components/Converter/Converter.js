import React, { useContext, useState, useReducer } from 'react'

import reducer from './reducer'
import { ServiceContext } from '../../contexts/ServiceContext'
import Pane from '../Pane'

let POCKETS = [
  { currency: 'GBP', amount: 5000 },
  { currency: 'USD', amount: 0 },
  { currency: 'EUR', amount: 0 },
  { currency: 'JPY', amount: 0 }
]

const Converter = () => {
  const [pockets, dispatch] = useReducer(reducer, POCKETS)
  const [sourceAmount, setSourceAmount] = useState(null)
  const [targetAmount, setTargetAmount] = useState(null)
  const [sourceIndex, setSourceIndex] = useState(0)
  const [targetIndex, setTargetIndex] = useState(pockets.length - 1)

  const { getCurrencyRate } = useContext(ServiceContext)

  const getRate = (fromCurrency, toCurrency) => {
    const rate = getCurrencyRate(fromCurrency, toCurrency)
    return (rate) ? rate : 0
  }

  const convertCurrency = (fromAmount, fromCurrency, isSource, isViable) => {
    const index = (isSource) ? targetIndex : sourceIndex
    const setAmount = (isSource) ? setTargetAmount : setSourceAmount
    const toCurrency = pockets[index].currency
    const toAmount = fromAmount * getCurrencyRate(fromCurrency, toCurrency)

    setAmount(!isNaN(toAmount) && toAmount > 0 ? toAmount : null)

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
        crossIndex={targetIndex}
        getRate={getRate}
        setIndex={setSourceIndex}
        convertCurrency={convertCurrency}
        calculatedAmount={sourceAmount}
        setAmount={setSourceAmount}
        isSource
      />
      <Pane
        pockets={pockets}
        activeIndex={targetIndex}
        crossIndex={sourceIndex}
        getRate={getRate}
        setIndex={setTargetIndex}
        convertCurrency={convertCurrency}
        calculatedAmount={targetAmount}
        setAmount={setTargetAmount}
      />
    </>
  )
}

export default Converter
