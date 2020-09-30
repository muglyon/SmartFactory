import loggerConfig from '../src/loggerConfig'; 

describe("loggerConfig tests", () => {
    it("The logger should have the level ALL", () => {
        expect((loggerConfig().getLogger().level as any).levelStr).toBe("ALL");
    });
});