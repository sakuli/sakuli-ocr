import { postprocessScreenshot } from "./postprocessScreenshot";
import fs from "fs";
import { join } from "path";

const md5File = require("md5-file");

describe("postprocess screenshot", () => {
  it("should modify screenshot to match snapshot image", async () => {
    //GIVEN
    const originalScreenshot = join(
      process.cwd(),
      "src/functions/__mocks__/sakuli-screen.png"
    );
    const screenshotToModify = join(
      process.cwd(),
      "src/functions/__mocks__/sakuli-screen-modify.png"
    );
    await fs.copyFileSync(originalScreenshot, screenshotToModify);

    const expectedResult = join(
      process.cwd(),
      "src/functions/__mocks__/sakuli-screen-snapshot.png"
    );

    //WHEN
    await postprocessScreenshot(screenshotToModify);

    //THEN
    try {
      expect(md5File.sync(screenshotToModify)).toEqual(
        md5File.sync(expectedResult)
      );
    } finally {
      fs.unlinkSync(screenshotToModify);
    }
  });
});
