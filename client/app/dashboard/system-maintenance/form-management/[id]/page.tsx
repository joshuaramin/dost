import FormID from "@/lib/interface/form-management/[id]/page";
import React from "react";

export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return <FormID id={id} />;
}
