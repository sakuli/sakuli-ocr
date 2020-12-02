import { ThenableRegion } from "@sakuli/legacy";
import { execSync } from "child_process";
import { join } from "path";
import { Project, TestExecutionContext } from "@sakuli/core";
import {
  createThenableEnvironmentClass,
  createThenableRegionClass,
} from "@sakuli/legacy/dist/context/common";
import fs from "fs";
import { regionCapture } from "./regionCapture";
import { searchTextInLines } from "./functions/searchTextInLines";
import { searchSingleWord } from "./functions/searchSingleWord";
import { createConvertAltoElementToRegion } from "./functions/createConvertAltoElementToRegion";

const { JSDOM } = require("jsdom");

export function getRegionByText(
  searchText: string,
  project: Project,
  testExecutionContext: TestExecutionContext,
  searchRegion?: ThenableRegion
): ThenableRegion {
  const ThenableRegionClass = createThenableRegionClass(
    testExecutionContext,
    project
  );
  const thenableEnvironment = new (createThenableEnvironmentClass(
    testExecutionContext,
    project
  ))();
  const convertAltoElementToRegion = createConvertAltoElementToRegion(
    testExecutionContext,
    ThenableRegionClass
  );

  const screenshotName = "ocr-screenshot.png";
  const screenshotPath = join(process.cwd(), screenshotName);

  if (!searchRegion) {
    return new ThenableRegionClass(
      0,
      0,
      0,
      0,
      thenableEnvironment.takeScreenshot(screenshotName).then(analyzeScreen)
    );
  } else {
    return new ThenableRegionClass(
      0,
      0,
      0,
      0,
      searchRegion.then((region) =>
        regionCapture(region, screenshotName).then(analyzeScreen)
      )
    );
  }

  function analyzeScreen(): ThenableRegion {
    try {
      const altoXmlString = execSync(
        `tesseract ${screenshotPath} stdout quiet alto`
      );

      const altoXml = new JSDOM(altoXmlString).window.document;
      return findText(searchText, altoXml, searchRegion);
    } catch (e) {
      testExecutionContext.logger.debug(
        `Error while searching for text with psm=3: ${e.message}`
      );
    } finally {
      fs.unlinkSync(screenshotPath);
    }

    testExecutionContext.logger.debug("Start second search with psm=11");
    const altoXmlString = execSync(
      `tesseract --psm 11 ${screenshotPath} stdout quiet alto`
    );
    fs.unlinkSync(screenshotPath);

    const altoXml = new JSDOM(altoXmlString).window.document;
    return findText(searchText, altoXml, searchRegion);
  }

  function findText(
    searchText: string,
    altoXml: any,
    searchRegion?: ThenableRegion
  ) {
    if (searchText.includes(" ")) {
      const lineContainingText = searchTextInLines(searchText, altoXml);
      return convertAltoElementToRegion(
        lineContainingText,
        searchText,
        searchRegion
      );
    } else {
      const elementContainingWord = searchSingleWord(searchText, altoXml);
      return convertAltoElementToRegion(
        elementContainingWord,
        searchText,
        searchRegion
      );
    }
  }
}
