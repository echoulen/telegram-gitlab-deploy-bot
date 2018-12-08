import {List} from "immutable";

export function getLastTag(tags: Array<{name: string}>): {name: string} {
  return List(tags)
    .map(({name}) => {
      const v = name.replace("v", "").split("-rc");
      const mainVersion = List(v[0].split("."))
        .map(it => it.length === 1 ? `0${it}` : it)
        .join("");
      const rcVersion = v[1] ? v[1].length === 1 ? `0${v[1]}` : v[1] : "00";
      const value = mainVersion + rcVersion;
      return {name, value: Number(value)};
    })
    .filter(it => it.value > 0)
    .sortBy(it => it.value)
    .last();
}
