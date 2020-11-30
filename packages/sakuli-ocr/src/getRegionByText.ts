import { ThenableRegion, Region } from "@sakuli/legacy";
import { execSync } from "child_process";
import { join } from "path";
import { Project, TestExecutionContext } from "@sakuli/core";
import {
  createThenableEnvironmentClass,
  createThenableRegionClass,
} from "@sakuli/legacy/dist/context/common";
import fs from "fs";
import { regionCapture } from "./regionCapture";
const { JSDOM } = require("jsdom");

export function getRegionByText(
  searchText: string,
  project: Project,
  testExecutionContext: TestExecutionContext,
  thenableRegion?: ThenableRegion
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

    let xOffset = 0
    let yOffset = 0
    if(thenableRegion){
      xOffset = thenableRegion._left || 0
      yOffset = thenableRegion._top || 0
    }

    if(!searchText.includes(" ")){
      const stringElementArray = Array.from(altoXml.querySelectorAll("String"));
      let elementMatchingText;

      for(let index = 0; index < stringElementArray.length; index++){
        const currentElement = stringElementArray[index] as any;
        const textContent = currentElement.attributes.getNamedItem("CONTENT").value;
        if(searchText === textContent){
          elementMatchingText = currentElement
          break;
        }
      }

      if(!elementMatchingText){
        throw Error(`Could not find text "${searchText}" on screen.`)
      }

      const x = parseInt(elementMatchingText.attributes.getNamedItem("HPOS").value)
      const y = parseInt(elementMatchingText.attributes.getNamedItem("VPOS").value)
      const width = parseInt(elementMatchingText.attributes.getNamedItem("WIDTH").value)
      const height = parseInt(elementMatchingText.attributes.getNamedItem("HEIGHT").value)
      testExecutionContext.logger.debug(`Found text "${searchText}" on location {x: ${x}, y: ${y}, width: ${width}, height: ${height}}`)
      return new ThenableRegionClass(x+xOffset, y+yOffset, width, height)
    }
    else {
      const textLineArray = Array.from(altoXml.querySelectorAll("TextLine"));
      for(let textLineIndex = 0; textLineIndex < textLineArray.length; textLineIndex++){
        const currentTextLine = textLineArray[textLineIndex] as any;
        let textInLine = ""
        const childNodes = currentTextLine.querySelectorAll("String")
        for(let wordIndex = 0; wordIndex < childNodes.length; wordIndex++){
          const currentElement = childNodes[wordIndex];
          textInLine += `${currentElement.attributes.getNamedItem("CONTENT").value} `;
        }
        if(textInLine.includes(searchText)){
          const x = parseInt(currentTextLine.attributes.getNamedItem("HPOS").value)
          const y = parseInt(currentTextLine.attributes.getNamedItem("VPOS").value)
          const width = parseInt(currentTextLine.attributes.getNamedItem("WIDTH").value)
          const height = parseInt(currentTextLine.attributes.getNamedItem("HEIGHT").value)
          testExecutionContext.logger.debug(`Found text "${searchText}" on location {x: ${x}, y: ${y}, width: ${width}, height: ${height}}`)
          return new ThenableRegionClass(x+xOffset, y+yOffset, width, height)
        }
      }
    }
    throw Error(`Could not find text "${searchText}" on screen.`)
  }

  if(!thenableRegion){
    return new ThenableRegionClass(
        0,
        0,
        0,
        0,
        thenableEnvironment.takeScreenshot(screenshotName).then(analyzeScreen)
    );
  }else{
    return new ThenableRegionClass(
        0,
        0,
        0,
        0,
        thenableRegion.then(region => regionCapture(region, screenshotName).then(analyzeScreen))
    );
  }

}
