import { ThenableRegion } from "@sakuli/legacy";
import { execSync } from "child_process";
import { join } from "path";
import { Project, TestExecutionContext } from "@sakuli/core";
import {
  createThenableEnvironmentClass,
  createThenableRegionClass,
} from "@sakuli/legacy/dist/context/common";
import fs from "fs";
const jsdom = require("jsdom");

export function getRegionByText(
  text: string,
  project: Project,
  testExecutionContext: TestExecutionContext
): ThenableRegion {
  const ThenableRegionClass = createThenableRegionClass(
    testExecutionContext,
    project
  );
  const thenableEnvironment = new (createThenableEnvironmentClass(
    testExecutionContext,
    project
  ))();

  const screenshotName = "ocr-screenshot.png";
  const screenshotPath = join(process.cwd(), screenshotName);

  function analyzeScreen(): ThenableRegion {
    const altoXmlString = execSync(
      `tesseract ${screenshotPath} stdout quiet alto`
    );
    fs.unlinkSync(screenshotPath);

    const altoXml = new jsdom.JSDOM(altoXmlString);
    return new ThenableRegionClass(10, 10, 10, 10);
  }

  return new ThenableRegionClass(
    0,
    0,
    0,
    0,
    thenableEnvironment.takeScreenshot(screenshotName).then(analyzeScreen)
  );
}
