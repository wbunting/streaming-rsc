"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { streamComponent } from "./actions";

export default function Home() {
  const [component, setComponent] = useState<React.ReactNode>();

  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <main className="flex flex-col gap-8 row-start-2 items-center sm:items-start">
        <form
          onSubmit={async (e) => {
            e.preventDefault();
            setComponent(await streamComponent());
          }}
        >
          <Button>Stream Component</Button>
        </form>
        <div>{component}</div>
      </main>
      <footer className="row-start-3 flex gap-6 flex-wrap items-center justify-center"></footer>
    </div>
  );
}
