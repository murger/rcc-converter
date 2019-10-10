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
    red: '#cc3333',
    blue: '#3399cc',
    grey: '#a5a5a5',
    greyDark: '#7c7c7c',
    greyLight: '#c8c8c8',
    white: '#ffffff',
    black: '#2a2a2a',
  }
}
