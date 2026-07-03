import { Braces, Database, Code2, Terminal, Cog, Boxes } from "lucide-react"

const formats = [
  { icon: Braces, label: "JSON Rules" },
  { icon: Database, label: "SQL Logic" },
  { icon: Code2, label: "Pseudocode" },
  { icon: Terminal, label: "Python Conditions" },
  { icon: Cog, label: "Rules Engine Format" },
  { icon: Boxes, label: "Model Features" },
]

export function RuleExport() {
  return (
    <section id="rules" className="bg-background py-20 sm:py-28">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
          <div className="max-w-xl">
            <span className="text-sm font-semibold uppercase tracking-wider text-primary">
              Rule Export
            </span>
            <h2 className="mt-3 text-balance text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
              From written policy to developer-ready logic
            </h2>
            <p className="mt-4 text-pretty text-lg leading-relaxed text-muted-foreground">
              Convert healthcare policy text into structured outputs your
              technical teams can use — no manual translation from documents to
              code required.
            </p>

            <div className="mt-8 grid gap-3 sm:grid-cols-2">
              {formats.map((format) => {
                const Icon = format.icon
                return (
                  <div
                    key={format.label}
                    className="flex items-center gap-3 rounded-xl border border-border bg-card px-4 py-3 transition-colors hover:border-primary/40"
                  >
                    <span className="grid size-9 shrink-0 place-items-center rounded-lg bg-accent text-accent-foreground">
                      <Icon className="size-4" />
                    </span>
                    <span className="text-sm font-medium text-foreground">
                      {format.label}
                    </span>
                  </div>
                )
              })}
            </div>
          </div>

          {/* Code preview */}
          <div className="rounded-2xl border border-white/10 bg-primary p-2 shadow-2xl shadow-primary/20">
            <div className="flex items-center gap-2 px-3 py-2">
              <span className="size-2.5 rounded-full bg-white/25" />
              <span className="size-2.5 rounded-full bg-white/25" />
              <span className="size-2.5 rounded-full bg-white/25" />
              <span className="ml-2 text-xs font-medium text-primary-foreground/60">
                billing_policy.rules.json
              </span>
            </div>
            <pre className="overflow-x-auto rounded-xl bg-black/30 p-5 font-mono text-[13px] leading-relaxed text-primary-foreground/90">
              <code>{`{
  "rule_id": "CMS-2026-014",
  "source": "CMS_Billing_Policy_2026.pdf",
  "if": {
    "procedure_code": "99213",
    "place_of_service": "telehealth"
  },
  "then": {
    "modifier_required": "95",
    "reimbursement": "eligible"
  },
  "risk_level": "medium",
  "review_status": "approved"
}`}</code>
            </pre>
          </div>
        </div>
      </div>
    </section>
  )
}
