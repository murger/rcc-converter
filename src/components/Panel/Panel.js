import { array, func, object } from 'prop-types'
import React, { useRef, useState } from 'react'
import styled, { withTheme } from 'styled-components'
import MaskedInput from 'react-text-mask'
import createNumberMask from 'text-mask-addons/dist/createNumberMask'

import { getColor } from '../../theme'
import formatCurrency from '../../utils/formatCurrency'
import getCurrencySign from '../../utils/getCurrencySign'
import getNodeIndex from '../../utils/getNodeIndex'
import sanitiseAmount from '../../utils/sanitiseAmount'

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


const Pocket = styled(({ color, ...rest }) => <div {...rest} />)`
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
  color: ${({ color }) => getColor(color === 'white' ? 'black' : 'white')};
  background-color: ${({ color }) => getColor(color)};

  input {
    color: inherit;
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
  opacity: ${({ isVisible }) => isVisible ? 0.35 : 0};
`

const Panel = ({
  panel,
  pockets,
  targetPanel,
  getCurrencyRate,
  convertCurrency,
  updatePanel
}) => {
  const input = useRef(null)
  const [isFocused, setFocused] = useState(false)
  const { activePocket, amount, autoFocus, color } = panel

  const pocket = pockets[activePocket]
  const targetPocket = pockets[targetPanel.activePocket]

  const currencyMask = createNumberMask({
    ...inputMaskOptions,
    prefix: getCurrencySign(pocket.currency)
  })

  const handleKeyUp = ({ target, key }) => {
    const amount = sanitiseAmount(target.value)
    const isViable = (key === 'Enter' && amount <= pocket.amount)
    const bypassKeys = ['Tab', 'Shift', 'ArrowRight', 'ArrowLeft']

    // Don't calculate when navigating
    if (!bypassKeys.includes(key)) {
      convertCurrency(amount, panel, targetPanel, isViable)
    }
  }

  // Pocket switching with keys
  const handleKeyDown = (event) => {
    const isUp = (event.key === 'ArrowUp')
    const isDown = (event.key === 'ArrowDown')

    if (isUp || isDown) {
      let targetIndex = (isUp) ? activePocket - 1 : activePocket + 1

      if (targetIndex < 0) {
        targetIndex = pockets.length - 1
      } else if (targetIndex >= pockets.length) {
        targetIndex = 0
      }

      setActivePocket(null, targetIndex)
      event.preventDefault()
    }
  }

  const handleBlur = () => setFocused(false)
  const handleFocus = () => setFocused(true)

  const setActivePocket = (event, idx) => {
    const index = (event) ? getNodeIndex(event.target) : idx
    const element = input.current.inputElement
    const value = element.value
    const length = value.length
    const amount = sanitiseAmount(value)

    element.focus()
    element.setSelectionRange(length, length)
    convertCurrency(amount, panel, targetPanel, false)
    updatePanel({ type: 'INDEX', activePocket: index, id: panel.id })
  }

  return (
    <Pocket color={color}>
      <Wrapper textAlign='center'>
        {pockets.map(p => (
          <Option
            key={p.currency}
            isActive={p.currency === pocket.currency}
            onClick={setActivePocket}>
            {p.currency}
          </Option>
        ))}
      </Wrapper>
      <Wrapper width='70%' textAlign='right'>
        <Notice isVisible={isFocused && input.current.inputElement.value}>
          Press &uarr;&darr; to change currency or
          &crarr; to buy <b>{getCurrencySign(targetPocket.currency)}</b>
          &nbsp;@&nbsp;
          {getCurrencyRate(pocket.currency, targetPocket.currency).toFixed(5)}
        </Notice>
        <AmountInput
          ref={input}
          value={amount}
          mask={currencyMask}
          onKeyUp={handleKeyUp}
          onKeyDown={handleKeyDown}
          onBlur={handleBlur}
          onFocus={handleFocus}
          autoFocus={autoFocus}
        />
        <AmountPocket>
          You have {formatCurrency(pocket.amount, pocket.currency)}
        </AmountPocket>
      </Wrapper>
    </Pocket>
  )
}

Panel.propTypes = {
  panel: object.isRequired,
  targetPanel: object.isRequired,
  pockets: array.isRequired,
  getCurrencyRate: func.isRequired,
  convertCurrency: func.isRequired,
  updatePanel: func.isRequired
}

export default withTheme(Panel)