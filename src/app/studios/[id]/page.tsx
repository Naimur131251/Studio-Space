import { StudioDetailsContant } from "@/components/shared/StudioDetails";
import { Suspense } from "react";

export default function StudioDetailsPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center text-white">
          Loading...
        </div>
      }
    >
      <StudioDetailsContant />
    </Suspense>
  );
}
