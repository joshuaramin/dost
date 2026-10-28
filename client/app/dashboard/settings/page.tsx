import SettingsPage from "@/lib/ui/dashboard/settings/page";
import { Suspense } from "react";

export default function Page({
  searchParams,
}: {
  searchParams: Promise<{ activeTab: string }>;
}) {
  return (
    <Suspense>
      <SettingsPage />;
    </Suspense>
  );
}
