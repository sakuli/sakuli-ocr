jest.mock("./searchTextInLines");
jest.mock("./searchSingleWord");
jest.mock("./createConvertAltoElementToRegion");

import { mockPartial } from "sneer";
import { TestExecutionContext } from "@sakuli/core";
import { createFindText } from "./findText";
import { mockAltoXml } from "./__mocks__/mockAltoXml";
import { ThenableRegion } from "@sakuli/legacy";
import { searchSingleWord } from "./searchSingleWord";
import { searchTextInLines } from "./searchTextInLines";
import { createConvertAltoElementToRegion } from "./createConvertAltoElementToRegion";

describe("findText", () => {
  const testExecutionContextMock = mockPartial<TestExecutionContext>({});
  const ThenableRegionClassMock = jest.fn();

  const convertAltoElementToRegionMock = jest.fn();

  beforeEach(() => {
    jest.resetAllMocks();
    (createConvertAltoElementToRegion as jest.Mock).mockImplementation(
      () => convertAltoElementToRegionMock
    );
  });

  const altoXml = mockAltoXml("foobar");
  const searchRegion = mockPartial<ThenableRegion>({ _height: 91 });
  const xOffset = 42;
  const yOffset = 84;
  const altoLineWithText = { xml: "fancy alto data" };

  it("should search for single words", () => {
    //GIVEN
    const searchText = "foobar";
    const findText = createFindText(
      testExecutionContextMock,
      ThenableRegionClassMock
    );

    (searchSingleWord as jest.Mock).mockImplementation(() => altoLineWithText);

    //WHEN
    findText(searchText, altoXml, searchRegion, xOffset, yOffset);

    //THEN
    expect(searchSingleWord).toBeCalledWith(searchText, altoXml);
    expect(convertAltoElementToRegionMock).toBeCalledWith(
      altoLineWithText,
      searchText,
      searchRegion,
      xOffset,
      yOffset
    );
  });

  it("should search for multiple words", () => {
    //GIVEN
    const searchText = "foo bar";
    const findText = createFindText(
      testExecutionContextMock,
      ThenableRegionClassMock
    );

    (searchTextInLines as jest.Mock).mockImplementation(() => altoLineWithText);

    //WHEN
    findText(searchText, altoXml, searchRegion, xOffset, yOffset);

    //THEN
    expect(searchTextInLines).toBeCalledWith(searchText, altoXml);
    expect(convertAltoElementToRegionMock).toBeCalledWith(
      altoLineWithText,
      searchText,
      searchRegion,
      xOffset,
      yOffset
    );
  });
});
