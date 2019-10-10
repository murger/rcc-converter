import React, { useContext, useState } from 'react'

import { ServiceContext } from '../../contexts/ServiceContext'
import Pane from '../Pane'

const POCKETS = [
  { currency: 'GBP', amount: 1000 },
  { currency: 'USD', amount: 0 },
  { currency: 'EUR', amount: 0 }
]

const Converter = () => {
  const service = useContext(ServiceContext);
  const [targetAmount, setTargetAmount] = useState(0)

  const sourceIndex = 0
  const targetIndex = POCKETS.length - 1

  const convertCurrency = (amount, currency) => {
    const targetRate = service.getCurrencyRate(POCKETS[targetIndex].currency)
    const targetAmount = amount * targetRate

    setTargetAmount(!isNaN(targetAmount) ? targetAmount : 0)
  }

  return (
    <>
      <Pane pockets={POCKETS} activeIndex={sourceIndex} isSource convertCurrency={convertCurrency} />
      <Pane pockets={POCKETS} activeIndex={targetIndex} amount={targetAmount} />
    </>
  )
}

export default Converter
