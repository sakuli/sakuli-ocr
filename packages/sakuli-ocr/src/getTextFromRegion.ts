import { Region } from "@sakuli/legacy";
import { execSync } from "child_process";
import { join } from "path";
import fs from "fs";
import { regionCapture } from "./regionCapture";

export async function getTextFromRegion(region: Region): Promise<string> {
  await regionCapture(region, "ocr-screenshot.png");
  const text = execSync(
    `tesseract ${join(process.cwd(), "ocr-screenshot.png")} stdout`
  );
  fs.unlinkSync(join(process.cwd(), "ocr-screenshot.png"));
  return Promise.resolve(text.toString());
}
