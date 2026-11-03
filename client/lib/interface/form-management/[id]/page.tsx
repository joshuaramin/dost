import React from "react";

interface FormIDProps {
  id: string;
}

export default function FormID({ id }: FormIDProps) {
  return <div>FormID: {id}</div>;
}
