"use client";

import dynamic from 'next/dynamic';
import { Loader2 } from "lucide-react";

// Dynamically import the content with SSR disabled to prevent Anchor env var issues during build
const AgentsContent = dynamic(() => import('./AgentsContent'), {
  ssr: false,
  loading: () => (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center">
      <Loader2 className="w-8 h-8 animate-spin text-indigo-500" />
    </div>
  ),
});

export default function AgentsPage() {
  return <AgentsContent />;
}
