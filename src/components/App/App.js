import React, { Component, Fragment } from 'react'
import { ThemeProvider } from 'styled-components'
import { GlobalStyles, theme } from '../../theme'
import { ServiceProvider } from '../../contexts/ServiceContext'
import Converter from '../Converter'

class App extends Component {
  render () {
    return (
      <ThemeProvider theme={theme}>
        <Fragment>
          <GlobalStyles />
          <ServiceProvider>
            <Converter />
          </ServiceProvider>
        </Fragment>
      </ThemeProvider>
    )
  }
}

export default App
