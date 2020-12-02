import { Region, ThenableRegion } from "@sakuli/legacy";
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
import { createCanvas, loadImage } from "canvas";

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
      thenableEnvironment
        .takeScreenshot(screenshotName)
        .then(analyzeScreen)
        .then(deleteScreenshot)
        .catch(deleteScreenshotOnError)
    );
  } else {
    return new ThenableRegionClass(
      0,
      0,
      0,
      0,
      searchRegion.then((region) =>
        regionCapture(region, screenshotName)
          .then(analyzeScreen)
          .then(deleteScreenshot)
          .catch(deleteScreenshotOnError)
      )
    );
  }

  function deleteScreenshot(region: Region) {
    fs.unlinkSync(screenshotPath);
    return region;
  }

  function deleteScreenshotOnError(error: Error) {
    fs.unlinkSync(screenshotPath);
    throw error;
  }

  function searchOnScreenshot(xOffset?: number, yOffset?: number) {
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
  }

  function analyzeScreen(): ThenableRegion {
    try {
      return searchOnScreenshot();
    } catch (e) {
      testExecutionContext.logger.debug(
        `Issue while searching with plain screenshot: ${e.message}`
      );
    }
    testExecutionContext.logger.debug(
      "Start another search with preprocessed image."
    );
    return new ThenableRegionClass(
      0,
      0,
      0,
      0,
      postProcessScreenshot().then(({ xOffset, yOffset }) =>
        searchOnScreenshot(xOffset, yOffset)
      )
    );
  }

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

  async function postProcessScreenshot() {
    const borderThickness = 10;
    const screenshot = await loadImage(screenshotPath);
    const canvas = createCanvas(
      screenshot.width + borderThickness * 2,
      screenshot.height + borderThickness * 2
    );
    const ctx = canvas.getContext("2d");

    ctx.drawImage(screenshot, borderThickness * 2, borderThickness * 2);

    ctx.fillStyle = "rgb(255,255,255)";
    ctx.fillRect(0, 0, screenshot.width + borderThickness * 2, borderThickness);
    ctx.fillRect(
      0,
      0,
      borderThickness,
      screenshot.height + borderThickness * 2
    );
    ctx.fillRect(
      0,
      screenshot.height + borderThickness,
      screenshot.width + borderThickness * 2,
      borderThickness
    );
    ctx.fillRect(
      screenshot.width + borderThickness,
      0,
      borderThickness,
      screenshot.height + borderThickness * 2
    );

    fs.writeFileSync(screenshotPath, canvas.toBuffer("image/png"));
    return { xOffset: -borderThickness * 2, yOffset: -borderThickness * 2 };
  }
}
