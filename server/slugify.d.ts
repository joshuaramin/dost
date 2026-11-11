declare module "slugify" {
  interface Options {
    replacement?: string;
    remove?: RegExp;
    lower?: boolean;
    strict?: boolean;
    locale?: string;
    trim?: boolean;
  }

  function slugify(text: string, options?: Options | string): string;

  namespace slugify {
    function extend(args: Record<string, unknown>): void;
  }

  export default slugify;
}
