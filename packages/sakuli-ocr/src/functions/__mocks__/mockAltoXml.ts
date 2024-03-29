export function mockAltoXml(xmlString: string) {
  const { JSDOM } = require("jsdom");
  return new JSDOM(mockAltoXmlString(xmlString)).window.document;
}

export function mockAltoXmlString(xmlString: string) {
  return `
      <?xml version="1.0" encoding="UTF-8"?>
      <alto xmlns="http://www.loc.gov/standards/alto/ns-v3#" xmlns:xlink="http://www.w3.org/1999/xlink" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xsi:schemaLocation="http://www.loc.gov/standards/alto/ns-v3# http://www.loc.gov/alto/v3/alto-3-0.xsd">
       <Description>
        <MeasurementUnit>pixel</MeasurementUnit>
        <sourceImageInformation>
         <fileName></fileName>
        </sourceImageInformation>
        <OCRProcessing ID="OCR_0">
         <ocrProcessingStep>
          <processingSoftware>
           <softwareName>tesseract 4.1.1</softwareName>
          </processingSoftware>
         </ocrProcessingStep>
        </OCRProcessing>
       </Description>
       <Layout>
        <Page WIDTH="230" HEIGHT="188" PHYSICAL_IMG_NR="0" ID="page_0">
         <PrintSpace HPOS="0" VPOS="0" WIDTH="230" HEIGHT="188">
          ${xmlString}
         </PrintSpace>
        </Page>
       </Layout>
      </alto>
      `;
}
