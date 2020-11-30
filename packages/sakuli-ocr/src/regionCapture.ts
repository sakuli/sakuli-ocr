import { screen } from "@nut-tree/nut-js";
import { Region } from "@sakuli/legacy";
import { Region as NutRegion } from "@nut-tree/nut-js/dist/lib/region.class";

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

  const regionImage = await (<any>screen).vision.grabScreenRegion(
    selectedNutRegion
  );
  await (<any>screen).vision.saveImage(regionImage, outputFilename);
}
