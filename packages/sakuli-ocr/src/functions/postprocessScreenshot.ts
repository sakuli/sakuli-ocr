import { createCanvas, loadImage } from "canvas";
import fs from "fs";

export async function postprocessScreenshot(screenshotPath: string) {
  const borderThickness = 10;
  const screenshot = await loadImage(screenshotPath);
  const canvas = createCanvas(
    screenshot.width + borderThickness * 2,
    screenshot.height + borderThickness * 2
  );
  const ctx = canvas.getContext("2d");

  ctx.drawImage(screenshot, borderThickness * 2, borderThickness * 2);

  ctx.fillStyle = "rgb(255,255,255)";
  //Top border
  ctx.fillRect(0, 0, screenshot.width + borderThickness * 2, borderThickness);
  //Left border
  ctx.fillRect(0, 0, borderThickness, screenshot.height + borderThickness * 2);
  //Bottom border
  ctx.fillRect(
    0,
    screenshot.height + borderThickness,
    screenshot.width + borderThickness * 2,
    borderThickness
  );
  //Right border
  ctx.fillRect(
    screenshot.width + borderThickness,
    0,
    borderThickness,
    screenshot.height + borderThickness * 2
  );

  fs.writeFileSync(screenshotPath, canvas.toBuffer("image/png"));
  return { xOffset: -borderThickness * 2, yOffset: -borderThickness * 2 };
}
