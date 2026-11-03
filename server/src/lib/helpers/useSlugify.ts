import { createRequire } from "node:module";

const require = createRequire(import.meta.url);

type SlugifyOptions = {
  replacement?: string;
  remove?: RegExp;
  lower?: boolean;
  strict?: boolean;
  locale?: string;
  trim?: boolean;
};

type SlugifyFunction = (
  text: string,
  options?: SlugifyOptions | string,
) => string;

const slugify = require("slugify") as SlugifyFunction;

const useSlugify = (text: string): string => {
  return slugify(text, {
    lower: true,
    trim: true,
    strict: true,
  });
};

export default useSlugify;
