(async () => {
    const testCase = new TestCase("Fry a typed egg");
    const url = "https://sakuli.io/e2e-pages/fryed-egg/license.html";
    const env = new Environment();
    const screen = new Region()
    try {
        await _navigateTo(url);
        await testCase.endOfStep("Navigate to sakuli website");

        await env.setSimilarity(.96)
        const region = await screen.find("assets/lets-fry-text.png");
        await region.highlight(1)
        await _assertEqual(await _getTextFromRegion(region), "License Information\n\f")

    } catch (e) {
        await testCase.handleException(e);
    } finally {
        await testCase.saveResult();
    }
})();
