import React, { useContext, useState, useReducer } from 'react'

import reducer from './reducer'
import { ServiceContext } from '../../contexts/ServiceContext'
import Pane from '../Pane'

const POCKETS = [
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

  const convertCurrency = (fromAmount, fromCurrency, isSource, isViable) => {
    const crossIndex = (isSource) ? targetIndex : sourceIndex
    const toCurrency = pockets[crossIndex].currency
    const toAmount = fromAmount * getCurrencyRate(fromCurrency, toCurrency)

    setSourceAmount((isSource ? fromAmount : toAmount) || null)
    setTargetAmount((isSource ? toAmount : fromAmount) || null)

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
        getCurrencyRate={getCurrencyRate}
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
        getCurrencyRate={getCurrencyRate}
        setIndex={setTargetIndex}
        convertCurrency={convertCurrency}
        calculatedAmount={targetAmount}
        setAmount={setTargetAmount}
      />
    </>
  )
}

export default Converter
