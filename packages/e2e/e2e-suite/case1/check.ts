(async () => {
    const testCase = new TestCase("Fry a typed egg");
    const url = "https://sakuli.io/e2e-pages/fryed-egg";
    try {
        await _navigateTo(url);
        await testCase.endOfStep("Navigate to sakuli website");

        const heading = await _fetch(_heading1(/LET'S FRY AN EGG/));
        const rect = await heading.getRect()
        const headingRegion = new Region(rect.x, rect.y+150, rect.width, rect.height)

        await headingRegion.highlight(1)

        await _assertEqual(await _getTextFromRegion(headingRegion), "LET'S FRY AN EGG")

    } catch (e) {
        await testCase.handleException(e);
    } finally {
        await testCase.saveResult();
    }
})();
