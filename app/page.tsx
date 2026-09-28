"use client";

import dynamic from "next/dynamic";

const EquationBench = dynamic(() => import("./EquationBench"), { ssr: false });

export default function Home() {
  return <EquationBench />;
}
