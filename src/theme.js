import { createGlobalStyle } from 'styled-components'

export const GlobalStyles = createGlobalStyle`
  html, body, main {
    height: 100%;
    overflow: hidden;
    user-select: none;
    background-color: #eaeaea;
    margin: auto;
  }

  body {
    padding: 0;
    font-family: 'Helvetica', Sans-serif;
    font-size: 16px;
    line-height: 24px;
    -webkit-tap-highlight-color: transparent;
  }
`

export const theme = {
  colors: {
    white: '#ffffff',
    black: '#2a2a2a'
  }
}

export  const getColor = (color) => theme.colors[color]
