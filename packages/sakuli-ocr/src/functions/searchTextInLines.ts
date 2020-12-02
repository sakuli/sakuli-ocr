export function searchTextInLines(searchText: string, altoXml: any) {
  const textLineArray = Array.from(altoXml.querySelectorAll("TextLine"));
  for (
    let textLineIndex = 0;
    textLineIndex < textLineArray.length;
    textLineIndex++
  ) {
    const currentTextLine = textLineArray[textLineIndex] as any;
    let textInLine = "";
    const childNodes = currentTextLine.querySelectorAll("String");
    for (let wordIndex = 0; wordIndex < childNodes.length; wordIndex++) {
      const currentElement = childNodes[wordIndex];
      textInLine += `${
        currentElement.attributes.getNamedItem("CONTENT").value
      } `;
    }
    if (textInLine.includes(searchText)) {
      return currentTextLine;
    }
  }
  throw new Error(`Search text ${searchText} could not be found on screen.`);
}
