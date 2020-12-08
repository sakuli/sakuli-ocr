jest.mock("@sakuli/legacy/dist/context/common");
jest.mock("./functions/searchTextOnScreenshot");
jest.mock("./functions/postprocessScreenshot");
jest.mock("./functions/regionCapture");

import { createSearchTextOnScreenshot } from "./functions/searchTextOnScreenshot";
import { getRegionByText } from "./getRegionByText";
import { mockPartial } from "sneer";
import { Project, TestExecutionContext } from "@sakuli/core";
import { SimpleLogger } from "@sakuli/commons";
import { Region, ThenableRegion } from "@sakuli/legacy";
import {
  createThenableEnvironmentClass,
  createThenableRegionClass,
} from "@sakuli/legacy/dist/context/common";
import mockFs from "mock-fs";
import mock from "mock-fs";
import fs from "fs";
import { postprocessScreenshot } from "./functions/postprocessScreenshot";
import { regionCapture } from "./functions/regionCapture";

describe("getRegionByText", () => {
  const project = mockPartial<Project>({});
  const searchText = "foobar";
  const testExecutionContextMock = mockPartial<TestExecutionContext>({
    logger: mockPartial<SimpleLogger>({
      debug: jest.fn(),
    }),
  });
  const expectedResultRegion = { _left: 42 };
  const ThenableRegionClassMock = jest.fn(async (x, y, w, h, callback) => {
    await callback;
    return expectedResultRegion;
  });
  (createThenableRegionClass as jest.Mock).mockReturnValue(
    ThenableRegionClassMock
  );
  const searchTextOnScreenshot = jest.fn();
  (createSearchTextOnScreenshot as jest.Mock).mockReturnValue(
    searchTextOnScreenshot
  );
  (searchTextOnScreenshot as jest.Mock).mockReturnValue(expectedResultRegion);

  const screenshotName = "ocr-screenshot.png";
  mockFs({});

  afterEach(() => {
    (postprocessScreenshot as jest.Mock).mockReset();
  });
  afterAll(() => mock.restore());

  describe("search on whole screen", () => {
    const takeScreenshotMock = jest.fn().mockImplementation((name) => {
      fs.writeFileSync(name, "data");
      return Promise.resolve();
    });
    const thenableEnvironmentMock = {
      takeScreenshot: takeScreenshotMock,
    };

    (createThenableEnvironmentClass as jest.Mock).mockReturnValue(
      jest.fn(() => {
        return thenableEnvironmentMock;
      })
    );

    it("should consider whole screen on search", async () => {
      //WHEN
      const resultRegion = await getRegionByText(
        searchText,
        project,
        testExecutionContextMock
      );

      //THEN
      expect(takeScreenshotMock).toBeCalledWith(
        expect.stringMatching(screenshotName)
      );
      expect(searchTextOnScreenshot).toBeCalledWith(
        searchText,
        expect.stringMatching(screenshotName),
        undefined
      );
      expect(fs.existsSync(screenshotName)).toBeFalsy();
      expect(resultRegion).toBe(expectedResultRegion);
    });

    it("should delete screenshot on error", async () => {
      //GIVEN
      (searchTextOnScreenshot as jest.Mock).mockImplementation(() => {
        throw Error("Error while searching text on screen");
      });
      (postprocessScreenshot as jest.Mock).mockImplementation(() => {
        throw Error("Error while postprocessing");
      });

      //WHEN
      const executeGetRegionByText = getRegionByText(
        searchText,
        project,
        testExecutionContextMock
      );

      //THEN
      await expect(() => executeGetRegionByText).rejects.toThrowError();
      expect(fs.existsSync(screenshotName)).toBeFalsy();
    });

    it("should search on post processed screenshot as fallback", async () => {
      //GIVEN
      const xOffset = 42;
      const yOffset = 84;

      (searchTextOnScreenshot as jest.Mock)
        .mockImplementationOnce(() => {
          throw Error("Error while searching text on screen");
        })
        .mockReturnValue(expectedResultRegion);

      (postprocessScreenshot as jest.Mock).mockResolvedValue({
        xOffset: xOffset,
        yOffset: yOffset,
      });

      //WHEN
      const resultRegion = await getRegionByText(
        searchText,
        project,
        testExecutionContextMock
      );

      //THEN
      expect(takeScreenshotMock).toBeCalledWith(
        expect.stringMatching(screenshotName)
      );
      expect(searchTextOnScreenshot).toBeCalledWith(
        searchText,
        expect.stringMatching(screenshotName),
        undefined,
        xOffset,
        yOffset
      );
      expect(fs.existsSync(screenshotName)).toBeFalsy();
      expect(resultRegion).toBe(expectedResultRegion);
    });
  });

  describe("search in region on screen", () => {
    const searchRegion = mockPartial<Region>({});
    const thenableRegion: ThenableRegion = mockPartial<ThenableRegion>({
      then: (onfulfilled) => {
        if (onfulfilled) {
          return Promise.resolve(onfulfilled(searchRegion));
        } else {
          return Promise.reject();
        }
      },
    });

    (regionCapture as jest.Mock).mockImplementation((_, name) => {
      fs.writeFileSync(name, "data");
      return Promise.resolve();
    });

    it("should consider provided region only on search", async () => {
      //GIVEN
      (searchTextOnScreenshot as jest.Mock).mockResolvedValue("");

      //WHEN
      const resultRegion = await getRegionByText(
        searchText,
        project,
        testExecutionContextMock,
        thenableRegion
      );

      //THEN
      expect(regionCapture).toBeCalledWith(searchRegion, screenshotName);
      expect(searchTextOnScreenshot).toBeCalledWith(
        searchText,
        expect.stringMatching(screenshotName),
        thenableRegion
      );
      expect(fs.existsSync(screenshotName)).toBeFalsy();
      expect(resultRegion).toBe(expectedResultRegion);
    });

    it("should delete screenshot on error", async () => {
      //GIVEN
      (searchTextOnScreenshot as jest.Mock).mockImplementation(() => {
        throw Error("Error while searching text on screen");
      });
      (postprocessScreenshot as jest.Mock).mockImplementation(() => {
        throw Error("Error while postprocessing");
      });

      //WHEN
      const executeGetRegionByText = getRegionByText(
        searchText,
        project,
        testExecutionContextMock,
        thenableRegion
      );

      //THEN
      await expect(() => executeGetRegionByText).rejects.toThrowError();
      expect(fs.existsSync(screenshotName)).toBeFalsy();
    });

    it("should search on post processed screenshot as fallback", async () => {
      //GIVEN
      const xOffset = 42;
      const yOffset = 84;

      (searchTextOnScreenshot as jest.Mock)
        .mockImplementationOnce(() => {
          throw Error("Error while searching text on screen");
        })
        .mockReturnValue(expectedResultRegion);

      (postprocessScreenshot as jest.Mock).mockResolvedValue({
        xOffset: xOffset,
        yOffset: yOffset,
      });

      //WHEN
      const resultRegion = await getRegionByText(
        searchText,
        project,
        testExecutionContextMock,
        thenableRegion
      );

      //THEN
      expect(regionCapture).toBeCalledWith(searchRegion, screenshotName);
      expect(searchTextOnScreenshot).toBeCalledWith(
        searchText,
        expect.stringMatching(screenshotName),
        thenableRegion,
        xOffset,
        yOffset
      );
      expect(fs.existsSync(screenshotName)).toBeFalsy();
      expect(resultRegion).toBe(expectedResultRegion);
    });
  });
});
