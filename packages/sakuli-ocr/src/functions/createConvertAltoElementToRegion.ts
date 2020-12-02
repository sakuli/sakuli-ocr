import { ThenableRegion } from "@sakuli/legacy";
import { TestExecutionContext } from "@sakuli/core";
import { Type } from "@sakuli/commons";

export function createConvertAltoElementToRegion(
  testExecutionContext: TestExecutionContext,
  ThenableRegionClass: Type<ThenableRegion>
) {
  return (
    elementToConvert: any,
    searchText: string,
    searchRegion?: ThenableRegion
  ) => {
    const coordinates = altoElementsToCoordinates(
      elementToConvert,
      searchRegion
    );
    testExecutionContext.logger.debug(
      `Found text "${searchText}" on location {x: ${coordinates.x}, y: ${coordinates.y}, width: ${coordinates.width}, height: ${coordinates.height}}`
    );
    return new ThenableRegionClass(
      coordinates.x,
      coordinates.y,
      coordinates.width,
      coordinates.height
    );
  };
}

function altoElementsToCoordinates(
  elementMatchingText: any,
  baseRegion?: ThenableRegion
) {
  //TODO: Add offset if image has been found with offset
  let xOffset = 0;
  let yOffset = 0;
  if (baseRegion) {
    xOffset = baseRegion._left || 0;
    yOffset = baseRegion._top || 0;
  }

  const x = parseInt(elementMatchingText.attributes.getNamedItem("HPOS").value);
  const y = parseInt(elementMatchingText.attributes.getNamedItem("VPOS").value);
  const width = parseInt(
    elementMatchingText.attributes.getNamedItem("WIDTH").value
  );
  const height = parseInt(
    elementMatchingText.attributes.getNamedItem("HEIGHT").value
  );
  return { x: x + xOffset, y: y + yOffset, width: width, height: height };
}
