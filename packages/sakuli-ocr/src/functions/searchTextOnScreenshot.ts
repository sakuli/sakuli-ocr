import { execSync } from "child_process";
import { TestExecutionContext } from "@sakuli/core";
import { ThenableRegion } from "@sakuli/legacy";
import { Type } from "@sakuli/commons";
import { searchTextInLines } from "./searchTextInLines";
import { searchSingleWord } from "./searchSingleWord";
import { createConvertAltoElementToRegion } from "./createConvertAltoElementToRegion";

export function createSearchTextOnScreenshot(
  testExecutionContext: TestExecutionContext,
  ThenableRegionClass: Type<ThenableRegion>
) {
  const { JSDOM } = require("jsdom");
  const convertAltoElementToRegion = createConvertAltoElementToRegion(
    testExecutionContext,
    ThenableRegionClass
  );

  return (
    searchText: string,
    screenshotPath: string,
    searchRegion?: ThenableRegion,
    xOffset?: number,
    yOffset?: number
  ) => {
    try {
      const altoXmlString = execSync(
        `tesseract ${screenshotPath} stdout quiet alto`
      );

      const altoXml = new JSDOM(altoXmlString).window.document;
      return findText(searchText, altoXml, searchRegion, xOffset, yOffset);
    } catch (e) {
      testExecutionContext.logger.debug(
        `Issue while searching for text with psm=3: ${e.message}`
      );
    }
    testExecutionContext.logger.debug("Start another search with psm=11");
    const altoXmlString = execSync(
      `tesseract --psm 11 ${screenshotPath} stdout quiet alto`
    );

    const altoXml = new JSDOM(altoXmlString).window.document;
    return findText(searchText, altoXml, searchRegion, xOffset, yOffset);
  };

  function findText(
    searchText: string,
    altoXml: any,
    searchRegion?: ThenableRegion,
    xOffset?: number,
    yOffset?: number
  ) {
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
  }
}
