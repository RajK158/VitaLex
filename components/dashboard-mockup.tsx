import { Layers, FileText, GitCompare, ScrollText, TrendingUp, AlertTriangle } from "lucide-react"

const bars = [42, 58, 36, 72, 64, 88, 54]

const stats = [
  { label: "Documents Reviewed", value: "1,284", icon: FileText },
  { label: "Policy Changes Detected", value: "47", icon: GitCompare },
  { label: "Rules Generated", value: "312", icon: ScrollText },
  { label: "High Impact Changes", value: "9", icon: AlertTriangle },
]

const docs = [
  { name: "CMS_Billing_Policy_2026.pdf", badge: "Summarized" },
  { name: "Payer_Contract_Aetna_v3.docx", badge: "Compared" },
  { name: "Clinical_Guideline_Diabetes.pdf", badge: "Rules Ready" },
]

export function DashboardMockup() {
  return (
    <div className="w-full rounded-2xl border border-white/10 bg-white p-3 shadow-2xl shadow-black/30 ring-1 ring-black/5">
      <div className="overflow-hidden rounded-xl bg-secondary/40">
        {/* Top bar */}
        <div className="flex items-center justify-between border-b border-border bg-card px-4 py-3">
          <div className="flex items-center gap-2">
            <span className="grid size-6 place-items-center rounded-md bg-primary text-primary-foreground">
              <Layers className="size-3.5" />
            </span>
            <span className="text-sm font-semibold text-foreground">Policy Intelligence Overview</span>
          </div>
          <div className="flex gap-1.5">
            <span className="size-2.5 rounded-full bg-border" />
            <span className="size-2.5 rounded-full bg-border" />
            <span className="size-2.5 rounded-full bg-primary/30" />
          </div>
        </div>

        {/* Body */}
        <div className="grid gap-3 p-4">
          {/* Stat cards */}
          <div className="grid grid-cols-2 gap-3">
            {stats.map((stat) => {
              const Icon = stat.icon
              return (
                <div key={stat.label} className="rounded-lg border border-border bg-card p-3">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-medium leading-tight text-muted-foreground">
                      {stat.label}
                    </span>
                    <Icon className="size-3.5 shrink-0 text-primary" />
                  </div>
                  <p className="mt-1 text-xl font-semibold text-foreground">{stat.value}</p>
                </div>
              )
            })}
          </div>

          {/* Chart card */}
          <div className="rounded-lg border border-border bg-card p-3">
            <div className="mb-3 flex items-center justify-between">
              <span className="text-xs font-medium text-foreground">Policy Activity</span>
              <span className="inline-flex items-center gap-1 text-[11px] text-muted-foreground">
                <TrendingUp className="size-3" /> Last 7 weeks
              </span>
            </div>
            <div className="flex h-20 items-stretch gap-2">
              {bars.map((h, i) => (
                <div key={i} className="flex h-full flex-1 flex-col justify-end">
                  <div
                    className="w-full rounded-t-sm bg-primary"
                    style={{ height: `${h}%`, opacity: 0.45 + (h / 100) * 0.55 }}
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Document rows */}
          <div className="grid gap-2">
            {docs.map((doc) => (
              <div
                key={doc.name}
                className="flex items-center gap-3 rounded-lg border border-border bg-card p-2.5"
              >
                <span className="grid size-8 place-items-center rounded-md bg-accent text-accent-foreground">
                  <FileText className="size-4" />
                </span>
                <p className="min-w-0 flex-1 truncate text-xs font-medium text-foreground">
                  {doc.name}
                </p>
                <span className="shrink-0 rounded-full bg-primary/10 px-2 py-0.5 text-[10px] font-semibold text-primary">
                  {doc.badge}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
