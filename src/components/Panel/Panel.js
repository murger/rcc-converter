import { array, func, object } from 'prop-types'
import React, { useRef, useState, useEffect } from 'react'
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

const Pocket = styled(({ mode, ...rest }) => <div {...rest} />)`
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
  color: ${({ mode }) => getColor(mode === 'light' ? 'black' : 'white')};
  background-color: ${({ mode }) => getColor(mode === 'light' ? 'white' : 'black')};
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
  color: inherit;
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
  pockets,
  panel,
  targetPanel,
  getCurrencyRate,
  convertCurrency,
  updatePanel
}) => {
  const { pocketIndex, amount, autoFocus, mode } = panel

  const input = useRef(null)
  const [isFocused, setFocused] = useState(autoFocus)

  const pocket = pockets[pocketIndex]
  const targetPocket = pockets[targetPanel.pocketIndex]

  // On pocket change
  useEffect(() => {
    convertCurrency(amount, panel, targetPanel, false)
  }, [pocketIndex])

  const handleValue = (event) => {
    const amount = sanitiseAmount(event.target.value)
    const transfer = (event.key === 'Enter' && amount > 0 && amount <= pocket.amount)
    const bypass = ['Tab', 'Shift', 'ArrowRight', 'ArrowLeft', 'ArrowUp', 'ArrowDown']

    // Don't calculate when navigating
    if (!bypass.includes(event.key)) {
      convertCurrency(amount, panel, targetPanel, transfer)
    }
  }

  // Pocket switching with keys
  const handleArrowKeys = (event) => {
    const isUp = (event.key === 'ArrowUp')
    const isDown = (event.key === 'ArrowDown')

    if (isUp || isDown) {
      let targetIndex = (isUp) ? pocketIndex - 1 : pocketIndex + 1

      if (targetIndex < 0) {
        targetIndex = pockets.length - 1
      } else if (targetIndex >= pockets.length) {
        targetIndex = 0
      }

      setActivePocket(null, targetIndex)
      event.preventDefault()
    }
  }

  const setActivePocket = async (event, targetIndex) => {
    const pocketIndex = (event) ? getNodeIndex(event.target) : targetIndex
    const inputElement = input.current.inputElement
    const value = inputElement.value
    const length = value.length

    inputElement.focus()
    inputElement.setSelectionRange(length, length) // put cursor at the end
    updatePanel({ type: 'INDEX', pocketIndex, id: panel.id })
  }

  const handleBlur = () => setFocused(false)
  const handleFocus = () => setFocused(true)

  const currencyMask = createNumberMask({
    ...inputMaskOptions,
    prefix: getCurrencySign(pocket.currency)
  })

  return (
    <Pocket mode={mode}>
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
        <Notice isVisible={isFocused && amount}>
          Press &uarr;&darr; to change currency or
          &crarr; to buy <b>{getCurrencySign(targetPocket.currency)}</b>
          &nbsp;@&nbsp;
          {getCurrencyRate(pocket.currency, targetPocket.currency).toFixed(5)}
        </Notice>
        <AmountInput
          ref={input}
          value={amount}
          mask={currencyMask}
          onKeyUp={handleValue}
          onKeyDown={handleArrowKeys}
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
  pockets: array.isRequired,
  panel: object.isRequired,
  targetPanel: object.isRequired,
  getCurrencyRate: func.isRequired,
  convertCurrency: func.isRequired,
  updatePanel: func.isRequired,
}

export default withTheme(Panel)
