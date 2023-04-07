export const escapeName = (name: string): string =>
  name.includes("[") ||
  name.includes("-") ||
  (name.length && !Number.isNaN(name[0]))
    ? `'${name}'`
    : name;
