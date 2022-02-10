import { screen, Region as NutRegion } from "@nut-tree/nut-js";
import { Region } from "@sakuli/legacy";

export async function regionCapture(
  selectedRegion: Region,
  outputFilename: string
) {
  const selectedNutRegion = new NutRegion(
    (await selectedRegion.getX()) || 0,
    (await selectedRegion.getY()) || 0,
    (await selectedRegion.getW()) || 0,
    (await selectedRegion.getH()) || 0
  );

  await screen.captureRegion(outputFilename, selectedNutRegion);
}
