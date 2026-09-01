import { Medal } from "lucide-react"
import { Overline } from "@/components/Brand"
import { medalYears } from "@/data"

const CHAMPIONSHIPS = [
  { key: "dublin", label: "Dublin" },
  { key: "leinster", label: "Leinster" },
  { key: "allIreland", label: "All-Ireland" },
]

// Medal-tier colours for the gold/silver/bronze icons.
const TIERS = [
  { key: "gold", label: "Gold", color: "#c19a3e" },
  { key: "silver", label: "Silver", color: "#9aa0a6" },
  { key: "bronze", label: "Bronze", color: "#b07242" },
]

export default function Medals() {
  return (
    <section id="medals" className="section-pad">
      <div className="wrap">
        <div className="mx-auto max-w-[720px] text-center" data-reveal>
          <div className="flex justify-center">
            <Overline>02 — On the podium</Overline>
          </div>
          <h2 className="display-2 mt-4 font-serif">Championship medals, year on year</h2>
          <p className="mx-auto mt-5 max-w-[52ch] text-muted-foreground">
            Gold, silver and bronze won by club members at the Dublin, Leinster and All-Ireland
            championships.
          </p>
        </div>

        <div className="mx-auto mt-12 max-w-[720px] overflow-x-auto" data-reveal>
          <table className="w-full border-collapse">
            <caption className="sr-only">
              Championship medals won by Civil Service Harriers members, by year, championship and
              medal type
            </caption>
            <thead>
              <tr className="border-b border-border text-[0.72rem] uppercase tracking-[0.14em] text-muted-foreground">
                <th scope="col" className="py-3 pr-4 text-left font-medium">
                  Year
                </th>
                <th scope="col" className="py-3 pr-4 text-left font-medium">
                  Championship
                </th>
                {TIERS.map((t) => (
                  <th key={t.key} scope="col" className="px-3 py-3 font-medium">
                    <span className="inline-flex items-center justify-center gap-1.5">
                      <Medal className="size-4" style={{ color: t.color }} aria-hidden="true" />
                      <span className="sr-only sm:not-sr-only">{t.label}</span>
                    </span>
                  </th>
                ))}
              </tr>
            </thead>
            {medalYears.map((y, yi) => (
              <tbody key={y.year}>
                {CHAMPIONSHIPS.map((c, ci) => (
                  <tr
                    key={c.key}
                    className={ci === 0 && yi > 0 ? "border-t border-border" : undefined}
                  >
                    {ci === 0 ? (
                      <th
                        scope="rowgroup"
                        rowSpan={CHAMPIONSHIPS.length}
                        className="py-4 pr-4 text-left align-middle font-serif text-2xl font-medium"
                      >
                        {y.year}
                      </th>
                    ) : null}
                    <th
                      scope="row"
                      className="py-3 pr-4 text-left text-sm font-medium text-foreground/80"
                    >
                      {c.label}
                    </th>
                    {TIERS.map((t) => (
                      <td
                        key={t.key}
                        className="px-3 py-3 text-center font-serif text-lg tabular-nums text-foreground/80"
                      >
                        {y[c.key]?.[t.key] ?? 0}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            ))}
          </table>
        </div>
      </div>
    </section>
  )
}
