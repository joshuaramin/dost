import AuthVerified from "@/lib/ui/auth/verified";
import React, { Suspense } from "react";

export default function Page() {
  return (
    <Suspense>
      <AuthVerified />;
    </Suspense>
  );
}
