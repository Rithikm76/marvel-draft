import * as Lucide from "lucide-react"
import type { LucideProps } from "lucide-react"

const toPascal = (key: string) =>
  key
    .split("-")
    .map((s) => s.charAt(0).toUpperCase() + s.slice(1))
    .join("")

const registry = Lucide as unknown as Record<string, React.ComponentType<LucideProps>>

export function SynergyIcon({ name, className }: { name: string; className?: string }) {
  const Comp = registry[toPascal(name)] ?? Lucide.Sparkles
  return <Comp className={className} aria-hidden="true" />
}
