import { ThenableRegion } from "@sakuli/legacy";
import { searchTextInLines } from "./searchTextInLines";
import { searchSingleWord } from "./searchSingleWord";
import { TestExecutionContext } from "@sakuli/core";
import { Type } from "@sakuli/commons";
import { createConvertAltoElementToRegion } from "./createConvertAltoElementToRegion";

export function createFindText(
  testExecutionContext: TestExecutionContext,
  ThenableRegionClass: Type<ThenableRegion>
) {
  const convertAltoElementToRegion = createConvertAltoElementToRegion(
    testExecutionContext,
    ThenableRegionClass
  );

  return (
    searchText: string,
    altoXml: any,
    searchRegion?: ThenableRegion,
    xOffset?: number,
    yOffset?: number
  ) => {
    if (searchText.includes(" ")) {
      const lineContainingText = searchTextInLines(searchText, altoXml);
      return convertAltoElementToRegion(
        lineContainingText,
        searchText,
        searchRegion,
        xOffset,
        yOffset
      );
    } else {
      const elementContainingWord = searchSingleWord(searchText, altoXml);
      return convertAltoElementToRegion(
        elementContainingWord,
        searchText,
        searchRegion,
        xOffset,
        yOffset
      );
    }
  };
}
