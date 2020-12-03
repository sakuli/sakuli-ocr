import { Region, ThenableRegion } from "@sakuli/legacy";
import { join } from "path";
import { Project, TestExecutionContext } from "@sakuli/core";
import {
  createThenableEnvironmentClass,
  createThenableRegionClass,
} from "@sakuli/legacy/dist/context/common";
import fs from "fs";
import { regionCapture } from "./regionCapture";
import { createSearchTextOnScreenshot } from "./functions/searchTextOnScreenshot";
import { postprocessScreenshot } from "./functions/postprocessScreenshot";

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

  const searchTextOnScreenshot = createSearchTextOnScreenshot(
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

  function analyzeScreen(): ThenableRegion {
    try {
      return searchTextOnScreenshot(searchText, screenshotPath, searchRegion);
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
      postprocessScreenshot(screenshotPath).then(({ xOffset, yOffset }) =>
        searchTextOnScreenshot(
          searchText,
          screenshotPath,
          searchRegion,
          xOffset,
          yOffset
        )
      )
    );
  }
}
