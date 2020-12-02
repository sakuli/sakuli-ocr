export function searchSingleWord(searchText: string, altoXml: any) {
  const elementMatchingText = findWordElement(searchText, altoXml);

  if (!elementMatchingText) {
    throw Error(`Could not find text "${searchText}" on screen.`);
  }

  return elementMatchingText;
}

function findWordElement(searchText: string, altoXml: any) {
  const stringElementArray = Array.from(altoXml.querySelectorAll("String"));

  for (let index = 0; index < stringElementArray.length; index++) {
    const currentElement = stringElementArray[index] as any;
    const textContent = currentElement.attributes.getNamedItem("CONTENT").value;
    if (searchText === textContent) {
      return currentElement;
    }
  }
}
