const getNodeIndex = (node) => {
  const element = node
  const siblings = element.parentNode.children
  const index = [].findIndex.call(siblings, (el) => el === element)

  return index
}

export default getNodeIndex
