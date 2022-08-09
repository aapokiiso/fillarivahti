export const waitForElementConnected = async (element: Node): Promise<void> => {
  if (!element.isConnected) {
    await new Promise(resolve => setTimeout(resolve, 10))
    waitForElementConnected(element)
  }
}
