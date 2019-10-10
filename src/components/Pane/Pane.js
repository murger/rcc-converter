import React from 'react'
import styled, { withTheme } from 'styled-components'
import MaskedInput from 'react-text-mask'
import createNumberMask from 'text-mask-addons/dist/createNumberMask'

import formatCurrency from '../../utils/formatCurrency'
import getCurrencySign from '../../utils/getCurrencySign'

const defaultMaskOptions = {
  prefix: '£',
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
  isSource,
  convertCurrency,
  amount
}) => {
  const pocket = pockets[activeIndex]
  const currencyMask = createNumberMask({
    ...defaultMaskOptions,
    prefix: getCurrencySign(pocket.currency)
  })

  const parseAmount = ({ target }) => {
    const amount = Number(target.value.replace(/[^0-9.-]+/g, ''))
    convertCurrency(amount, pocket.currency)
  }

  return (
    <Pocket isSource={isSource}>
      <Wrapper>
        <Label>{pocket.currency}</Label>
        {pockets.map(p => (
          <Option
            key={p.currency}
            isActive={p.currency === pocket.currency}>
            {p.currency}
          </Option>
        ))}
      </Wrapper>
      <Wrapper width='70%' textAlign='right'>
        <AmountPocket>You have {formatCurrency(pocket.amount, pocket.currency)}</AmountPocket>
        {isSource
          ? <AmountInput mask={currencyMask} onKeyUp={parseAmount} autoFocus />
          : <Amount>{formatCurrency(amount, pocket.currency)}</Amount>
        }
      </Wrapper>
    </Pocket>
  )
}

export default withTheme(Pane)
