import { createFileRoute } from "@tanstack/react-router";
import { GalagaGame } from "@/components/GalagaGame";

export const Route = createFileRoute("/")({ component: Home });

function Home() {
  return <GalagaGame />;
}
