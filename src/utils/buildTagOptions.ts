import {List} from "immutable";
import {Option} from "../types/Option";

export enum TagType {
  RC,
  PRODUCTION,
}

export function buildTagOptions(lastTag: {name: string}, type: TagType): List<Option> {
  if (!lastTag) {
    switch (type) {
      case TagType.RC:
        return List([
          {text: `0.0.1-rc1`, callback_data: `add-tag-v0.0.1-rc1`},
          {text: `0.1.0-rc1`, callback_data: `add-tag-v0.1.0-rc1`},
          {text: `1.0.0-rc1`, callback_data: `add-tag-v1.0.0-rc1`},
          {text: "取消", callback_data: `cancel-tag`},
        ]);
      default:
        return List([
          {text: `0.0.1`, callback_data: `add-tag-v0.0.1`},
          {text: `0.1.0`, callback_data: `add-tag-v0.1.0`},
          {text: `1.0.0`, callback_data: `add-tag-v1.0.0`},
          {text: "取消", callback_data: `cancel-tag`},
        ]);
    }
  }

  const vs = lastTag.name.split("-");
  const version = vs[0];
  const versions = version.split(".");
  const main = Number(versions[0].replace("v", ""));
  const minor = Number(versions[1]);
  const ver = Number(versions[2]);

  if (vs[1] && vs[1].indexOf("rc") === 0) {
    const rcNo = vs[1].slice(2, vs[1].length);

    switch (type) {
      case TagType.RC:
        return List([
          {
            text: `${main}.${minor}.${ver}-rc${Number(rcNo) + 1}`,
            callback_data: `add-tag-v${main}.${minor}.${ver}-rc${Number(rcNo) + 1}`,
          },
          {text: "取消", callback_data: `cancel-tag`},
        ]);
      default:
        return List([
          {
            text: `${main}.${minor}.${ver}`,
            callback_data: `add-tag-v${main}.${minor}.${ver}`,
          },
          {text: "取消", callback_data: `cancel-tag`},
        ]);
    }

  } else {
    switch (type) {
      case TagType.RC:
        return List([
          {
            text: `${main}.${minor}.${ver + 1}-rc1`,
            callback_data: `add-tag-v${main}.${minor}.${ver + 1}-rc1`,
          },
          {
            text: `${main}.${minor + 1}.0-rc1`,
            callback_data: `add-tag-v${main}.${minor + 1}.0-rc1`,
          },
          {
            text: `${main + 1}.0.0-rc1`,
            callback_data: `add-tag-v${main + 1}.0.0-rc1`,
          },
          {
            text: "取消",
            callback_data: `cancel-tag`,
          }
        ]);
      default:
        return List([
          {
            text: `${main}.${minor}.${ver + 1}`,
            callback_data: `add-tag-v${main}.${minor}.${ver + 1}`,
          },
          {
            text: `${main}.${minor + 1}.0`,
            callback_data: `add-tag-v${main}.${minor + 1}.0`,
          },
          {
            text: `${main + 1}.0.0`,
            callback_data: `add-tag-v${main + 1}.0.0`,
          },
          {
            text: "取消",
            callback_data: `cancel-tag`,
          }
        ]);
    }
  }
}
