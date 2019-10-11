import React from 'react'
import renderer from 'react-test-renderer'
import App from '../src/components/App'

// react-text-mask has the best UX but it doesn't yield well into testing
// https://github.com/text-mask/text-mask/issues/427
jest.mock('react-text-mask', () => props => <input {...props } />)

// Snapshot tests are good for catching unintended changes
it('renders correctly', () => {
  const tree = renderer.create(<App />).toJSON()
  expect(tree).toMatchSnapshot()
})
