import { array, bool, func, number } from 'prop-types'
import React, { useRef, useState } from 'react'
import styled, { withTheme } from 'styled-components'
import MaskedInput from 'react-text-mask'
import createNumberMask from 'text-mask-addons/dist/createNumberMask'

import { getColor } from '../../theme'
import formatCurrency from '../../utils/formatCurrency'
import getCurrencySign from '../../utils/getCurrencySign'
import getNodeIndex from '../../utils/getNodeIndex'

const inputMaskOptions = {
  suffix: '',
  includeThousandsSeparator: true,
  thousandsSeparatorSymbol: ',',
  allowDecimal: true,
  decimalSymbol: '.',
  decimalLimit: 2,
  integerLimit: 10,
  allowNegative: false,
  allowLeadingZeroes: false,
}

const Pocket = styled.div`
  position: relative;
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
  color: ${({ isSource }) => getColor(isSource ? 'black' : 'white')};
  background-color: ${({ isSource }) => getColor(isSource ? 'white' : 'black')};

  input {
    color: ${({ isSource }) => getColor(isSource ? 'black' : 'white')};
  }
`

const Wrapper = styled.div`
  display: inline-block;
  min-width: 180px;
  width: ${({ width }) => width ? width : 'auto'};
  text-align: ${({ textAlign }) => textAlign};
`

const Option = styled.p`
  display: block;
  margin: 0;
  padding: 0;
  margin-right: 6px;
  line-height: 1;
  font-weight: ${({ isActive }) => isActive ? '700' : '600'};
  font-size: ${({ isActive }) => isActive ? '74px' : '42px'};
  letter-spacing: ${({ isActive }) => isActive ? '-5px' : '-1px'};
  opacity: ${({ isActive }) => isActive ? 1 : 0.35};
  transition: all 0.2s;
  cursor: pointer;

  &:hover {
    opacity: 1;
  }
`

const AmountPocket = styled.p`
  margin: 0;
  padding: 0;
  margin-top: 12px;
  font-weight: 400;
  font-size: 28px;
  line-height: 1;
  letter-spacing: -0.5px;
  opacity: 0.65;
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
  background-color: transparent;

  &::-webkit-inner-spin-button,
  &::-webkit-outer-spin-button {
    -webkit-appearance: none;
  }
`

const Notice = styled.div`
  margin: 0;
  margin-bottom: 8px;
  font-weight: 400;
  font-size: 16px;
  line-height: 24px;
  text-align: right;
  letter-spacing: -0.5px;
  border-radius: 9px;
  opacity: 0.35;
`

const Pane = ({
  pockets,
  activeIndex,
  crossIndex,
  setIndex,
  getRate,
  convertCurrency,
  calculatedAmount,
  setAmount,
  isSource
}) => {
  const input = useRef(null)
  const [noticeVisible, setNoticeVisible] = useState(false)

  const pocket = pockets[activeIndex]
  const currencyMask = createNumberMask({
    ...inputMaskOptions,
    prefix: getCurrencySign(pocket.currency)
  })

  const crossCurrency = pockets[crossIndex].currency
  const sanitiseAmount = (value) => Number(value.replace(/[^0-9.-]+/g, ''))

  const handleKeyUp = ({ target, key }) => {
    const amount = sanitiseAmount(target.value)
    const isViable = (key === 'Enter' && amount <= pocket.amount)
    const bypassKeys = ['Tab', 'Shift', 'ArrowRight', 'ArrowLeft']

    // Don't calculate when navigating
    if (!bypassKeys.includes(key)) {
      setAmount(!isNaN(amount) && amount > 0 ? amount : null)
      convertCurrency(amount, pocket.currency, isSource, isViable)
    }
  }

  // Pocket switching with keys
  const handleKeyDown = (event) => {
    if (event.key === 'ArrowUp') {
      const prevIndex = activeIndex - 1
      switchPocket(null, (prevIndex >= 0) ? prevIndex : pockets.length - 1)
      event.preventDefault()
    } else if (event.key === 'ArrowDown') {
      const nextIndex = activeIndex + 1
      switchPocket(null, (nextIndex >= pockets.length) ? 0 : nextIndex)
      event.preventDefault()
    }
  }

  const handleBlur = () => setNoticeVisible(false)
  const handleFocus = () => setNoticeVisible(true)

  const switchPocket = (event, idx) => {
    const index = (!isNaN(idx)) ? idx : getNodeIndex(event.target)

    setIndex(index)

    const element = input.current.inputElement
    const value = element.value
    const length = value.length
    const amount = sanitiseAmount(value)

    element.focus()
    element.setSelectionRange(length, length)
    convertCurrency(amount, pockets[index].currency, isSource)
  }

  return (
    <Pocket isSource={isSource}>
      <Wrapper textAlign='center'>
        {pockets.map((p, index) => (
          <Option
            key={p.currency}
            isActive={p.currency === pocket.currency}
            onClick={switchPocket}>
            {p.currency}
          </Option>
        ))}
      </Wrapper>
      <Wrapper width='70%' textAlign='right'>
        {noticeVisible && input.current.inputElement.value
          ? <Notice>
              Press &uarr;&darr; to change currency or
              &crarr; to buy <b>{getCurrencySign(crossCurrency)}</b>
              &nbsp;@&nbsp;
              {Number(getRate(pocket.currency, crossCurrency)).toFixed(5)}
            </Notice>
          : <Notice>&nbsp;</Notice>
        }
        <AmountInput
          ref={input}
          value={calculatedAmount}
          mask={currencyMask}
          onKeyUp={handleKeyUp}
          onKeyDown={handleKeyDown}
          onBlur={handleBlur}
          onFocus={handleFocus}
          autoFocus={isSource}
        />
        <AmountPocket>
          You have {formatCurrency(pocket.amount, pocket.currency)}
        </AmountPocket>
      </Wrapper>
    </Pocket>
  )
}

Pane.propTypes = {
  pockets: array.isRequired,
  activeIndex: number,
  crossIndex: number,
  setIndex: func.isRequired,
  getRate: func.isRequired,
  convertCurrency: func.isRequired,
  setAmount: func.isRequired
}

Pane.defaultProps = {
  activeIndex: 0,
  crossIndex: 0,
  calculatedAmount: 0,
  isSource: false
}

export default withTheme(Pane)
