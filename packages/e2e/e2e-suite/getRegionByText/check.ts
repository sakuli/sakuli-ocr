(async () => {
  const testCase = new TestCase("getRegionByText");
  const url = "https://sakuli.io/e2e-pages/sandbox/#";
  try {
    await _navigateTo(url);
    await testCase.endOfStep("Navigate to website");

    await _getRegionByText("Every").highlight(1);
    await testCase.endOfStep("find 'Every'");

    await _getRegionByText("element in one place").highlight(1);
    await testCase.endOfStep("find 'element in one place'");
  } catch (e) {
    await testCase.handleException(e);
  } finally {
    await testCase.saveResult();
  }
})();
