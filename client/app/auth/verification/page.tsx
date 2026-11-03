import AuthVerification from "@/lib/ui/auth/verification";
import React, { Suspense } from "react";

export default function Page() {
  return (
    <Suspense>
      <AuthVerification />;
    </Suspense>
  );
}
