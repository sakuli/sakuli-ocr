import { Region } from "@sakuli/legacy";
import { Region as NutRegion, screen } from "@nut-tree/nut-js";
import { execSync } from "child_process";
import { join } from "path";
import * as fs from "fs";

export async function getTextFromRegion(region: Region): Promise<string> {
  const regionCapture = async (
    selectedRegion: NutRegion,
    outputFilename: string
  ) => {
    const regionImage = await (<any>screen).vision.grabScreenRegion(
      selectedRegion
    );
    await (<any>screen).vision.saveImage(regionImage, outputFilename);
  };

  await regionCapture(
    new NutRegion(
      (await region.getX()) || 0,
      (await region.getY()) || 0,
      (await region.getW()) || 0,
      (await region.getH()) || 0
    ),
    "ocr-screenshot.png"
  );
  const text = execSync(
    `tesseract ${join(process.cwd(), "ocr-screenshot.png")} stdout`
  );
  fs.unlinkSync(join(process.cwd(), "ocr-screenshot.png"));
  return Promise.resolve(text.toString());
}
