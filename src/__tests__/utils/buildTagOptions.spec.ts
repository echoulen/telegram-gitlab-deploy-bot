import {buildTagOptions} from "../../utils/buildTagOptions";

describe("buildTagOptions spec", () => {
  it("should buildTagOptions proper if tag = v0.0.1", () => {
    const options = buildTagOptions({name: "v0.0.1"});
    expect(options).toMatchSnapshot();
  });

  it("should buildTagOptions proper if tag = v2.3.5", () => {
    const options = buildTagOptions({name: "v2.3.5"});
    expect(options).toMatchSnapshot();
  });

  it("should buildTagOptions proper if tag = v2.1.0-rc5", () => {
    const options = buildTagOptions({name: "v2.1.0-rc5"});
    expect(options).toMatchSnapshot();
  });

  it("should buildTagOptions proper if tag = v1.0.0-rc10", () => {
    const options = buildTagOptions({name: "v1.0.0-rc10"});
    expect(options).toMatchSnapshot();
  });

  it("should buildTagOptions proper if tag = null", () => {
    const options = buildTagOptions(null);
    expect(options).toMatchSnapshot();
  });
});
