import type { CharacterVariant } from "@/lib/types"

function hash(str: string): number {
  let h = 0
  for (let i = 0; i < str.length; i++) h = (Math.imul(31, h) + str.charCodeAt(i)) | 0
  return Math.abs(h)
}

/**
 * Polished procedural character artwork. No external images means no broken
 * images — each variant gets a distinct themed, cinematic treatment driven by
 * its color theme + a deterministic hash for subtle per-variant variation.
 */
export function CharacterPortrait({
  variant,
  className = "",
}: {
  variant: CharacterVariant
  className?: string
}) {
  const { from, via, to, glow, emblem } = variant.theme
  const h = hash(variant.id)
  const angle = 120 + (h % 60)
  const spot1 = 20 + (h % 40)
  const spot2 = 60 + (h % 30)
  const initials =
    variant.variantName
      .split(/[\s-]+/)
      .map((w) => w[0])
      .join("")
      .slice(0, 3)
      .toUpperCase() || emblem

  return (
    <div
      className={`relative h-full w-full overflow-hidden ${className}`}
      style={{
        background: `linear-gradient(${angle}deg, ${from} 0%, ${via} 55%, ${to} 100%)`,
        containerType: "inline-size",
      }}
    >
      {/* energy spotlights */}
      <div
        className="absolute inset-0"
        style={{
          background: `radial-gradient(60% 55% at ${spot1}% 30%, ${glow}66, transparent 60%), radial-gradient(50% 45% at ${spot2}% 75%, ${via}55, transparent 65%)`,
        }}
      />
      {/* diagonal energy streaks */}
      <div
        className="absolute -inset-8 opacity-40 mix-blend-screen"
        style={{
          background: `repeating-linear-gradient(${angle - 30}deg, transparent 0 16px, ${glow}22 16px 18px)`,
        }}
      />
      {/* large stylized emblem */}
      <div className="absolute inset-0 flex items-center justify-center">
        <span
          className="font-display font-bold leading-none tracking-tighter select-none"
          style={{
            fontSize: "clamp(3rem, 42cqw, 9rem)",
            color: "rgba(255,255,255,0.14)",
            textShadow: `0 0 40px ${glow}88`,
          }}
        >
          {emblem}
        </span>
      </div>
      {/* foreground monogram badge */}
      <div className="absolute inset-0 flex items-center justify-center">
        <span
          className="font-display font-bold leading-none tracking-tight text-white/90"
          style={{
            fontSize: "clamp(1.4rem, 16cqw, 3rem)",
            textShadow: `0 4px 24px rgba(0,0,0,0.6), 0 0 30px ${glow}aa`,
          }}
        >
          {initials}
        </span>
      </div>
      {/* grain + vignette */}
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(120%_100%_at_50%_0%,transparent_55%,rgba(0,0,0,0.65)_100%)]" />
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-2/3 bg-gradient-to-t from-black/85 via-black/25 to-transparent" />
    </div>
  )
}
