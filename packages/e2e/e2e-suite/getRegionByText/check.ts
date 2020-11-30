(async () => {
  const testCase = new TestCase("getRegionByText");
  const url = "https://sakuli.io/e2e-pages/fryed-egg/license.html";
  const screen = new Region();
  try {
    await _navigateTo(url);
    await testCase.endOfStep("Navigate to sakuli website");
    await _getRegionByText("License").click();
    // await _getRegionByText("Main Use-Cases").highlight(1);
  } catch (e) {
    await testCase.handleException(e);
  } finally {
    await testCase.saveResult();
  }
})();
