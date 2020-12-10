import { Region } from "@sakuli/legacy";
import { Region as NutRegion, screen } from "@nut-tree/nut-js";
import { execSync } from "child_process";
import { join } from "path";
import * as fs from "fs";
import { regionCapture } from "./functions/regionCapture";

export async function getTextFromRegion(region: Region): Promise<string> {
  await regionCapture(region, "ocr-screenshot.png");
  const text = execSync(
    `tesseract ${join(process.cwd(), "ocr-screenshot.png")} stdout`
  );
  fs.unlinkSync(join(process.cwd(), "ocr-screenshot.png"));
  return Promise.resolve(text.toString());
}
