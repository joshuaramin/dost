import slugify from "slugify";

const useSlugify = (text: string) => {
  return slugify(text, {
    lower: true,
    trim: true,
    strict: true,
  });
};

export default useSlugify;
