import { Region } from "@sakuli/legacy";
import { execSync } from "child_process";
import { join } from "path";
import * as fs from "fs";
import { regionCapture } from "./functions/regionCapture";
import { TestExecutionContext } from "@sakuli/core";

export async function getTextFromRegion(
  region: Region,
  testExecutionContext: TestExecutionContext
): Promise<string> {
  await regionCapture(region, "ocr-screenshot.png");
  const text = execSync(
    `tesseract ${join(process.cwd(), "ocr-screenshot.png")} stdout`
  );
  testExecutionContext.logger.trace(`Text on screen:\n${text}\n`);
  fs.unlinkSync(join(process.cwd(), "ocr-screenshot.png"));
  return Promise.resolve(text.toString());
}
