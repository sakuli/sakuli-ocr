import { execSync } from "child_process";
import { TestExecutionContext } from "@sakuli/core";
import { ThenableRegion } from "@sakuli/legacy";
import { Type } from "@sakuli/commons";
import { createFindText } from "./findText";

export function createSearchTextOnScreenshot(
  testExecutionContext: TestExecutionContext,
  ThenableRegionClass: Type<ThenableRegion>
) {
  const findText = createFindText(testExecutionContext, ThenableRegionClass);

  function tesseractSearchOnScreenshot(
    tesseractCall: string,
    searchText: string,
    searchRegion?: ThenableRegion,
    xOffset?: number,
    yOffset?: number
  ) {
    const { JSDOM } = require("jsdom");
    testExecutionContext.logger.debug(`Calling tesseract: ${tesseractCall}`);
    const altoXmlString = execSync(tesseractCall);
    testExecutionContext.logger.trace(`received alto xml:\n${altoXmlString}\n`);
    const altoXml = new JSDOM(altoXmlString).window.document;
    return findText(searchText, altoXml, searchRegion, xOffset, yOffset);
  }

  return (
    searchText: string,
    screenshotPath: string,
    searchRegion?: ThenableRegion,
    xOffset?: number,
    yOffset?: number
  ) => {
    try {
      return tesseractSearchOnScreenshot(
        `tesseract "${screenshotPath}" stdout quiet alto`,
        searchText,
        searchRegion,
        xOffset,
        yOffset
      );
    } catch (e: any) {
      testExecutionContext.logger.debug(
        `Issue while searching for text with default psm: ${e.message}`
      );
    }
    testExecutionContext.logger.debug("Start another search with psm=11");
    return tesseractSearchOnScreenshot(
      `tesseract --psm 11 "${screenshotPath}" stdout quiet alto`,
      searchText,
      searchRegion,
      xOffset,
      yOffset
    );
  };
}
