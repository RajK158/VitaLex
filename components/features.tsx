import {
  Upload,
  FileText,
  GitCompare,
  ScrollText,
  MessageSquareText,
  ClipboardCheck,
  ArrowUpRight,
} from "lucide-react"
import { cn } from "@/lib/utils"

const features = [
  {
    icon: Upload,
    title: "Upload Healthcare Documents",
    description:
      "Upload billing policies, coding rules, payer-provider contracts, clinical guidelines, PDFs, Word docs, and text files into one organized workspace.",
  },
  {
    icon: FileText,
    title: "AI Document Summaries",
    description:
      "Turn long and complex healthcare documents into clear summaries for billing, compliance, clinical, and operations teams.",
  },
  {
    icon: GitCompare,
    title: "Compare Policy Versions",
    description:
      "Compare old and new versions of policies or contracts and instantly see what changed, what was removed, and what was added.",
  },
  {
    icon: ScrollText,
    title: "Convert Policies into Rules",
    description:
      "Transform written policy language into structured if-then rules that can support workflows, systems, and decision logic.",
  },
  {
    icon: MessageSquareText,
    title: "Smart Search and Chat",
    description:
      "Ask questions across uploaded documents and get grounded answers from the exact policy, guideline, or contract source.",
  },
  {
    icon: ClipboardCheck,
    title: "Audit Trail and Approvals",
    description:
      "Track version history, approvals, reviewers, and every important document action for compliance-ready governance.",
  },
]

function FeatureCard({
  feature,
  className,
}: {
  feature: (typeof features)[number]
  className?: string
}) {
  const Icon = feature.icon
  return (
    <article
      className={cn(
        "group relative flex flex-col overflow-hidden rounded-2xl bg-primary p-8 text-primary-foreground transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl hover:shadow-primary/25",
        className,
      )}
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-16 -top-16 size-40 rounded-full bg-white/5 opacity-0 blur-2xl transition-opacity duration-300 group-hover:opacity-100"
      />
      <div className="flex items-center justify-between">
        <span className="grid size-12 place-items-center rounded-xl bg-white/10 text-primary-foreground ring-1 ring-white/15 transition-colors group-hover:bg-white/15">
          <Icon className="size-6" />
        </span>
        <ArrowUpRight className="size-5 text-primary-foreground/40 transition-all duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-primary-foreground/80" />
      </div>
      <h3 className="mt-6 text-lg font-semibold leading-snug text-balance">
        {feature.title}
      </h3>
      <p className="mt-3 text-sm leading-relaxed text-primary-foreground/75">
        {feature.description}
      </p>
    </article>
  )
}

export function Features() {
  return (
    <section id="features" className="bg-background py-20 sm:py-28">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <span className="text-sm font-semibold uppercase tracking-wider text-primary">
            Features
          </span>
          <h2 className="mt-3 text-balance text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
            Everything healthcare teams need to manage complex policy content
          </h2>
          <p className="mt-4 text-pretty text-lg leading-relaxed text-muted-foreground">
            Six connected tools that turn dense policies, contracts, and
            guidelines into organized, searchable, and actionable knowledge.
          </p>
        </div>

        <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((feature) => (
            <FeatureCard key={feature.title} feature={feature} />
          ))}
        </div>
      </div>
    </section>
  )
}
