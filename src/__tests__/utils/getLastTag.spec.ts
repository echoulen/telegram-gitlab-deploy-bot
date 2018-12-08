import {getLastTag} from "../../utils/getLastTag";

describe("getLastTag spec", () => {
  it("should getLastTag proper", () => {
    const tags = [
      {"name": "v0.0.9"},
      {"name": "v0.0.8"},
      {"name": "v0.0.10"},
      {"name": "v0.0.1"},
    ];

    const lastTag = getLastTag(tags);
    expect(lastTag.name).toBe("v0.0.10");
  });

  it("should getLastTag proper", () => {
    const tags = [
      {"name": "v0.1.9"},
      {"name": "v0.1.8"},
      {"name": "v0.10.0-rc1"},
      {"name": "v0.10.0-rc3"},
      {"name": "v0.10.0-rc2"},
      {"name": "v0.1.1"},
    ];

    const lastTag = getLastTag(tags);
    expect(lastTag.name).toBe("v0.10.0-rc3");
  });

  it("should getLastTag proper", () => {
    const tags = [
      {"name": "v1.1.9"},
      {"name": "v0.1.8"},
      {"name": "v0.10.0-rc1"},
      {"name": "v0.10.0-rc3"},
      {"name": "v0.10.0-rc2"},
      {"name": "v0.1.1"},
    ];

    const lastTag = getLastTag(tags);
    expect(lastTag.name).toBe("v1.1.9");
  });
});
