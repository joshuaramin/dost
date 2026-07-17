import { AttachmentType } from "@/lib/prisma/system/generated/prisma/client";

export const getAttachmentType = (mimeType: string): AttachmentType => {
  if (mimeType.startsWith("image/")) {
    return AttachmentType.IMAGE;
  }

  if (mimeType.startsWith("video/")) {
    return AttachmentType.VIDEO;
  }

  if (mimeType.startsWith("audio/")) {
    return AttachmentType.AUDIO;
  }

  if (mimeType === "application/pdf") {
    return AttachmentType.PDF;
  }

  if (
    mimeType.includes("word") ||
    mimeType.includes("excel") ||
    mimeType.includes("powerpoint") ||
    mimeType.includes("text") ||
    mimeType.includes("officedocument")
  ) {
    return AttachmentType.DOCUMENT;
  }

  return AttachmentType.OTHER;
};
