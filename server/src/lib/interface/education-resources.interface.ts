import { BasicArgs } from "./basicargs";

export interface EducationalResourceInterface extends BasicArgs {
  category: string;
  status: "DRAFT" | "PUBLISHED" | "ARCHIVED" | string;
  type: "IMAGE" | "VIDEO" | "PDF" | "DOCUMENT" | "AUDIO" | "OTHER" | string;
  resource:
    | "ARTICLE"
    | "VIDEO"
    | "DOCUMENT"
    | "CATALOGUE"
    | "INFOGRAPHIC"
    | "WEBNAR"
    | "PODCAST"
    | "EXTERNAL_LINK"
    | string;
}
export interface EducationCategoryInterface extends BasicArgs {}
export interface EducationTagInterface extends BasicArgs {}
