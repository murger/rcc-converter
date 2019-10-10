import React, { PureComponent } from 'react'
import styled from 'styled-components'

import { ServiceContext, ServiceConsumer } from '../../contexts/ServiceContext'

const Title = styled.h2`
  margin: 0;
  margin-bottom: 24px;
  color: ${props => props.theme.navy};
  line-height: 70px;
`

class Converter extends PureComponent {
  static contextType = ServiceContext

  render () {
    return (
      <ServiceConsumer>
        {({ data, loading, error }) => (
          <p>Voila!</p>
        )}
      </ServiceConsumer>
    )
  }
}

export default Converter
