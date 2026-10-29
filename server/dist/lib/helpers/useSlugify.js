import slugify from "slugify";
const useSlugify = (text) => {
    return slugify(text, {
        lower: true,
        trim: true,
        strict: true,
    });
};
export default useSlugify;
