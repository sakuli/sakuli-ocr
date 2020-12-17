jest.mock("./findText");
jest.mock("child_process");

import { createSearchTextOnScreenshot } from "./searchTextOnScreenshot";
import { mockPartial } from "sneer";
import { TestExecutionContext } from "@sakuli/core";
import { SimpleLogger } from "@sakuli/commons";
import { createFindText } from "./findText";
import { ThenableRegion } from "@sakuli/legacy";
import { mockAltoXml, mockAltoXmlString } from "./__mocks__/mockAltoXml";
import { execSync } from "child_process";

describe("searchTextOnScreenshot", () => {
  const testExecutionContextMock = mockPartial<TestExecutionContext>({
    logger: mockPartial<SimpleLogger>({
      debug: jest.fn(),
      trace: jest.fn(),
    }),
  });

  const ThenableRegionClassMock = jest.fn();
  const findTextMock = jest.fn();

  beforeEach(() => {
    jest.resetAllMocks();
    (createFindText as jest.Mock).mockImplementation(() => findTextMock);
  });

  it("should search with tesseract in default config", () => {
    //GIVEN
    const searchString = "foo bar";
    const screenshotPath = "/path/to/screenshot";
    const searchRegion = mockPartial<ThenableRegion>({ _height: 91 });
    const xOffset = 42;
    const yOffset = 84;
    const expectedScreenRegion = mockPartial<ThenableRegion>({ _height: 84 });
    const expectedTesseractCall = `tesseract "${screenshotPath}" stdout quiet alto`;
    const mockedAltoXml = mockAltoXml("");

    (execSync as jest.Mock).mockImplementation(() => mockAltoXmlString(""));

    findTextMock.mockImplementation(() => expectedScreenRegion);

    const searchOnScreen = createSearchTextOnScreenshot(
      testExecutionContextMock,
      ThenableRegionClassMock
    );

    //WHEN
    const regionOnScreen = searchOnScreen(
      searchString,
      screenshotPath,
      searchRegion,
      xOffset,
      yOffset
    );

    //THEN
    expect(execSync).toBeCalledWith(expectedTesseractCall);
    expect(findTextMock).toBeCalledWith(
      searchString,
      expect.anything(),
      searchRegion,
      xOffset,
      yOffset
    );
    expect(findTextMock.mock.calls[0][1].documentElement.outerHTML).toBe(
      mockedAltoXml.documentElement.outerHTML
    );
    expect(regionOnScreen).toEqual(expectedScreenRegion);
  });

  it("should search with alternative config if default search fails ", () => {
    //GIVEN
    const searchString = "foo bar";
    const screenshotPath = "/path/to/screenshot";
    const searchRegion = mockPartial<ThenableRegion>({ _height: 91 });
    const xOffset = 42;
    const yOffset = 84;
    const expectedScreenRegion = mockPartial<ThenableRegion>({ _height: 84 });
    const expectedTesseractCall = `tesseract --psm 11 "${screenshotPath}" stdout quiet alto`;
    const mockedAltoXml = mockAltoXml("");

    (execSync as jest.Mock).mockImplementation(() => mockAltoXmlString(""));

    findTextMock
      .mockImplementationOnce(() => {
        throw Error("foo");
      })
      .mockImplementation(() => expectedScreenRegion);

    const searchOnScreen = createSearchTextOnScreenshot(
      testExecutionContextMock,
      ThenableRegionClassMock
    );

    //WHEN
    const regionOnScreen = searchOnScreen(
      searchString,
      screenshotPath,
      searchRegion,
      xOffset,
      yOffset
    );

    //THEN
    expect(execSync).toHaveBeenNthCalledWith(2, expectedTesseractCall);
    expect(findTextMock).toBeCalledWith(
      searchString,
      expect.anything(),
      searchRegion,
      xOffset,
      yOffset
    );
    expect(findTextMock.mock.calls[0][1].documentElement.outerHTML).toBe(
      mockedAltoXml.documentElement.outerHTML
    );
    expect(regionOnScreen).toEqual(expectedScreenRegion);
  });

  it("should throw after regular + fallback search ", () => {
    //GIVEN
    const screenshotPath = "/path/to/screenshot";

    const firstTesseractCall = `tesseract "${screenshotPath}" stdout quiet alto`;
    const secondTesseractCall = `tesseract --psm 11 "${screenshotPath}" stdout quiet alto`;

    const expectedError = Error("bar");
    findTextMock
      .mockImplementationOnce(() => {
        throw Error("foo");
      })
      .mockImplementation(() => {
        throw expectedError;
      });

    const searchOnScreen = createSearchTextOnScreenshot(
      testExecutionContextMock,
      ThenableRegionClassMock
    );

    //WHEN
    const searchOnScreenCall = () =>
      searchOnScreen("foo bar", "/path/to/screenshot");

    //THEN
    expect(searchOnScreenCall).toThrowError(expectedError);
    expect(execSync).toHaveBeenNthCalledWith(1, firstTesseractCall);
    expect(execSync).toHaveBeenNthCalledWith(2, secondTesseractCall);
  });
});
