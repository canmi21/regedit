/* src/pages/home-page.tsx */

import { InstanceManager } from "@/components/instance-manager";

function HomePage() {
  return (
    <main className="min-h-[100dvh] flex flex-col items-center justify-center bg-background-alt p-4">
      <div className="w-full max-w-2xl">
        <h1 className="text-3xl font-bold text-center text-primary mb-2">
          Namespaced
        </h1>
        <p className="text-center text-text-sub mb-8">
          A static registry editor for your Namespaced instances.
        </p>
        <InstanceManager />
      </div>
    </main>
  );
}

export default HomePage;
