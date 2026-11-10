import { createRequire } from "node:module";
const require = createRequire(import.meta.url);
const slugify = require("slugify");
const useSlugify = (text) => {
    return slugify(text, {
        lower: true,
        trim: true,
        strict: true,
    });
};
export default useSlugify;
