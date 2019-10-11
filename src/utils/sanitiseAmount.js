const sanitiseAmount = (value) => Number(value.replace(/[^0-9.-]+/g, ''))

export default sanitiseAmount
