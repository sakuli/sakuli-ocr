import { mockAltoXml } from "./__mocks__/mockAltoXml";
import { searchTextInLines } from "./searchTextInLines";

describe("search text in Lines", () => {
  it("should find search text in text lines", () => {
    //GIVEN
    const searchText = "foo bar";
    const expectedTextLineId = "line_1";
    const altoXml = mockAltoXml(`
            <ComposedBlock ID="cblock_0" >
                <TextBlock ID="block_0">
                    <TextLine ID="line_0" HPOS="39" VPOS="5" WIDTH="400" HEIGHT="16">
                        <String ID="string_0" CONTENT="all"/>
                        <String ID="string_1" CONTENT="hands"/>
                        <String ID="string_2" CONTENT="meeting"/>
                    </TextLine>
                    <TextLine ID="${expectedTextLineId}" HPOS="39" VPOS="5" WIDTH="400" HEIGHT="16">
                        <String ID="string_0" CONTENT="meta"/>
                        <String ID="string_1" CONTENT="syntactic"/>
                        <String ID="string_2" CONTENT="variables"/>
                        <String ID="string_3" CONTENT="are"/>
                        <String ID="string_4" CONTENT="foo"/>
                        <String ID="string_5" CONTENT="bar"/>
                    </TextLine>
                    <TextLine ID="line_2" HPOS="39" VPOS="5" WIDTH="400" HEIGHT="16">
                        <String ID="string_0" CONTENT="some"/>
                        <String ID="string_1" CONTENT="crazy"/>
                        <String ID="string_2" CONTENT="stuff"/>
                    </TextLine>
                </TextBlock>
            </ComposedBlock>
        `);

    //WHEN
    const lineWithText = searchTextInLines(searchText, altoXml);

    //THEN
    expect(lineWithText.attributes.getNamedItem("ID").value).toEqual(
      expectedTextLineId
    );
  });

  it("should throw if searched text cannot be found", () => {
    //GIVEN
    const searchText = "foo bar";
    const altoXml = mockAltoXml(`
            <ComposedBlock ID="cblock_0" >
                <TextBlock ID="block_0">
                    <TextLine ID="line_0" HPOS="39" VPOS="5" WIDTH="400" HEIGHT="16">
                        <String ID="string_0" CONTENT="all"/>
                        <String ID="string_1" CONTENT="hands"/>
                        <String ID="string_2" CONTENT="meeting"/>
                    </TextLine>
                </TextBlock>
            </ComposedBlock>
        `);

    //WHEN
    const searchTextCall = () => searchTextInLines(searchText, altoXml);

    //THEN
    expect(searchTextCall).toThrowError(
      `Search text "${searchText}" could not be found on screen.`
    );
  });
});
