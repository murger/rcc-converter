import React, { useRef, useEffect } from 'react'
import styled, { withTheme } from 'styled-components'
import MaskedInput from 'react-text-mask'
import createNumberMask from 'text-mask-addons/dist/createNumberMask'

import formatCurrency from '../../utils/formatCurrency'
import getCurrencySign from '../../utils/getCurrencySign'

const defaultMaskOptions = {
  suffix: '',
  includeThousandsSeparator: true,
  thousandsSeparatorSymbol: ',',
  allowDecimal: true,
  decimalSymbol: '.',
  decimalLimit: 2,
  integerLimit: 4,
  allowNegative: false,
  allowLeadingZeroes: false,
}

const Pocket = styled.div`
  display: flex;
  flex-shrink: 0;
  flex-basis: 100%;
  align-items: center;
  justify-content: space-between;
  padding: 24px 8vw;
  width: 100%;
  height: 50%;
  vertical-align: top;
  box-sizing: border-box;
  color: ${({ isSource, theme }) => isSource ? theme.colors.black : theme.colors.white};
  background-color: ${({ isSource, theme }) => isSource ? theme.colors.white : theme.colors.black};
`

const Wrapper = styled.div`
  display: inline-block;
  width: ${({ width }) => width ? width : 'auto'};
  text-align: ${({ textAlign }) => textAlign};
`

const Label = styled.h2`
  margin: 0;
  padding: 0;
  margin-bottom: 4px;
  font-size: 80px;
  line-height: 1;
  letter-spacing: -5px;
`

const Option = styled.p`
  display: inline-block;
  margin: 0;
  padding: 0;
  margin-right: 6px;
  font-size: 24px;
  line-height: 1;
  letter-spacing: -1px;
  opacity: ${({ isActive }) => isActive ? 1 : 0.35};
  cursor: pointer;

  &:hover {
    opacity: 1;
  }
`

const AmountPocket = styled.p`
  margin: 0;
  padding: 0;
  margin-bottom: 8px;
  font-weight: 400;
  font-size: 24px;
  line-height: 1;
  letter-spacing: -0.5px;
  opacity: 0.5;
`

const Amount = styled.p`
  margin: 0;
  padding: 0;
  font-weight: 300;
  font-size: 64px;
  line-height: 1;
  letter-spacing: -2px;
`

const AmountInput = styled(MaskedInput)`
  width: 100%;
  margin: 0;
  padding: 0;
  font-weight: 300;
  font-size: 64px;
  line-height: 1;
  letter-spacing: -2px;
  text-align: right;
  border: 0;
  outline: 0;

  &::-webkit-inner-spin-button,
  &::-webkit-outer-spin-button {
    -webkit-appearance: none;
  }
`

const Pane = ({
  pockets,
  activeIndex,
  setIndex,
  convertCurrency,
  calculatedAmount,
  isSource
}) => {
  const input = useRef(null);
  const pocket = pockets[activeIndex]
  const currencyMask = createNumberMask({
    ...defaultMaskOptions,
    prefix: getCurrencySign(pocket.currency)
  })

  const sanitiseAmount = (value) => Number(value.replace(/[^0-9.-]+/g, ''))

  const convertAmount = ({ target, key }) => {
    const amount = sanitiseAmount(target.value)
    const isViable = (key === 'Enter' && amount <= pocket.amount)

    convertCurrency(amount, pocket.currency, isViable)
  }

  useEffect(() => {
    if (input.current) {
      const element = input.current.inputElement
      const value = element.value
      const length = value.length
      const amount = sanitiseAmount(value)

      element.focus()
      element.setSelectionRange(length, length) // position cursor
      convertCurrency(amount, pocket.currency) // convert again
    }
  }, [activeIndex])

  return (
    <Pocket isSource={isSource}>
      <Wrapper>
        <Label>{pocket.currency}</Label>
        {pockets.map((p, index) => (
          <Option
            key={p.currency}
            isActive={p.currency === pocket.currency}
            onClick={() => setIndex(index)}>
            {p.currency}
          </Option>
        ))}
      </Wrapper>
      <Wrapper width='70%' textAlign='right'>
        <AmountPocket>You have {formatCurrency(pocket.amount, pocket.currency)}</AmountPocket>
        {isSource
          ? <AmountInput mask={currencyMask} onKeyUp={convertAmount} ref={input} autoFocus />
          : <Amount>{formatCurrency(calculatedAmount, pocket.currency)}</Amount>
        }
      </Wrapper>
    </Pocket>
  )
}

export default withTheme(Pane)
