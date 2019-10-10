import { createGlobalStyle } from 'styled-components'

export const GlobalStyles = createGlobalStyle`
  body {
		max-width: 960px;
		margin: 0 auto;
    padding: 32px 24px;
    font-family: 'Helvetica', Sans-serif;
    font-size: 16px;
    line-height: 24px;
    -webkit-tap-highlight-color: transparent;

    @media (max-width: 960px) {
      padding-right: 16px !important;
    }

    @media (max-width: 480px) {
      padding: 32px 16px;
    }
  }
`

export const theme = {
  colors: {
    red: '#cc3333',
    blue: '#3399cc',
    grey: '#a5a5a5',
    greyDark: '#7c7c7c',
    greyLight: '#c8c8c8',
    white: '#f0f0f0',
    black: '#2a2a2a',
  }
}
