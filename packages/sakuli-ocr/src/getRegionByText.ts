import { ThenableRegion } from "@sakuli/legacy";
import { execSync } from "child_process";
import { join } from "path";
import { Project, TestExecutionContext } from "@sakuli/core";
import {
  createThenableEnvironmentClass,
  createThenableRegionClass,
} from "@sakuli/legacy/dist/context/common";
import fs from "fs";
const { JSDOM } = require("jsdom");

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

    const altoXml = new JSDOM(altoXmlString).window.document;
    if(!text.includes(" ")){
      const stringElementArray = Array.from(altoXml.querySelectorAll("String"));
      let elementMatchingText;

      for(let index = 0; index < stringElementArray.length; index++){
        const currentElement = stringElementArray[index] as any;
        const textContent = currentElement.attributes.getNamedItem("CONTENT").value;
        if(text === textContent){
          elementMatchingText = currentElement
          break;
        }
      }

      if(!elementMatchingText){
        throw Error(`Could not find text "${text}" on screen.`)
      }

      const x = parseInt(elementMatchingText.attributes.getNamedItem("HPOS").value)
      const y = parseInt(elementMatchingText.attributes.getNamedItem("VPOS").value)
      const width = parseInt(elementMatchingText.attributes.getNamedItem("WIDTH").value)
      const height = parseInt(elementMatchingText.attributes.getNamedItem("HEIGHT").value)
      testExecutionContext.logger.debug(`Found text "${text}" on location {x: ${x}, y: ${y}, width: ${width}, height: ${height}}`)
      return new ThenableRegionClass(x, y, width, height)
    }

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
