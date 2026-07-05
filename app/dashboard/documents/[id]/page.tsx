"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import Link from "next/link"
import { supabase } from "@/lib/supabase"

type DocumentRow = {
  id: string
  file_name: string
  file_path: string
  file_type: string | null
  file_size: number | null
  document_type: string | null
  payer: string | null
  department: string | null
  status: string | null
  created_at: string
  summary: string | null
  extracted_text: string | null
  approval_status: string | null
  approved_at: string | null
  published_at: string | null
  approval_notes: string | null
}

type GeneratedRule = {
  rule_id: string
  title: string
  condition: string
  action: string
  department: string
  risk_level: string
  source_reference: string
}

const riskBadgeStyles: Record<string, string> = {
  low: "border-emerald-500/40 text-emerald-400",
  medium: "border-amber-500/40 text-amber-400",
  high: "border-red-500/40 text-red-400",
}

const EXTRACTED_TEXT_PREVIEW_LENGTH = 3000

const APPROVAL_STATUS_OPTIONS = [
  { value: "draft", label: "Draft" },
  { value: "in_review", label: "In Review" },
  { value: "approved", label: "Approved" },
  { value: "published", label: "Published" },
]

const approvalStatusLabels: Record<string, string> = {
  draft: "Draft",
  in_review: "In Review",
  approved: "Approved",
  published: "Published",
}

const approvalStatusBadgeStyles: Record<string, string> = {
  draft: "border-zinc-700 text-zinc-300",
  in_review: "border-amber-500/40 text-amber-400",
  approved: "border-emerald-500/40 text-emerald-400",
  published: "border-sky-500/40 text-sky-400",
}

const roleLabels: Record<string, string> = {
  admin: "Admin",
  compliance: "Compliance",
  billing_coding: "Billing/Coding",
  analyst: "Analyst",
  developer: "Developer",
  viewer: "Viewer",
}

const inputClassName =
  "w-full rounded-xl border border-zinc-800/80 bg-black/60 px-4 py-3 text-sm text-zinc-200 transition placeholder:text-zinc-600 hover:border-zinc-700 focus:border-zinc-600 focus:outline-none focus:ring-1 focus:ring-zinc-700/50"

const sectionCardClassName =
  "rounded-2xl border border-zinc-800/80 bg-zinc-950/90 shadow-sm shadow-black/20"

const primaryButtonClassName =
  "rounded-full bg-white px-5 py-3 text-sm font-semibold text-black transition hover:bg-zinc-200 disabled:opacity-50"

const secondaryButtonClassName =
  "rounded-full border border-zinc-700/80 bg-zinc-950 px-4 py-2 text-xs font-semibold text-zinc-200 transition hover:border-zinc-600 hover:bg-zinc-900 disabled:opacity-50"

const headerButtonClassName =
  "rounded-full border border-zinc-800 bg-zinc-950/80 px-4 py-2 text-xs font-semibold text-zinc-300 transition hover:border-zinc-700 hover:bg-zinc-900"

type RolePermissions = {
  canUpload: boolean
  canGenerateSummary: boolean
  canGenerateRules: boolean
  canExportRules: boolean
  canCompare: boolean
  canUpdateApproval: boolean
  canDelete: boolean
}

const ROLE_PERMISSIONS: Record<string, RolePermissions> = {
  admin: {
    canUpload: true,
    canGenerateSummary: true,
    canGenerateRules: true,
    canExportRules: true,
    canCompare: true,
    canUpdateApproval: true,
    canDelete: true,
  },
  compliance: {
    canUpload: false,
    canGenerateSummary: false,
    canGenerateRules: false,
    canExportRules: true,
    canCompare: true,
    canUpdateApproval: true,
    canDelete: false,
  },
  billing_coding: {
    canUpload: false,
    canGenerateSummary: false,
    canGenerateRules: true,
    canExportRules: true,
    canCompare: true,
    canUpdateApproval: false,
    canDelete: false,
  },
  analyst: {
    canUpload: true,
    canGenerateSummary: true,
    canGenerateRules: false,
    canExportRules: false,
    canCompare: true,
    canUpdateApproval: false,
    canDelete: false,
  },
  developer: {
    canUpload: false,
    canGenerateSummary: false,
    canGenerateRules: false,
    canExportRules: true,
    canCompare: false,
    canUpdateApproval: false,
    canDelete: false,
  },
  viewer: {
    canUpload: false,
    canGenerateSummary: false,
    canGenerateRules: false,
    canExportRules: false,
    canCompare: false,
    canUpdateApproval: false,
    canDelete: false,
  },
}

function getRolePermissions(role: string | null | undefined): RolePermissions {
  return ROLE_PERMISSIONS[role || "viewer"] || ROLE_PERMISSIONS.viewer
}

type RuleExportFormat = "json" | "pseudocode" | "sql" | "python"

const ruleExportFormatLabels: Record<RuleExportFormat, string> = {
  json: "JSON",
  pseudocode: "Pseudocode",
  sql: "SQL",
  python: "Python",
}

function downloadRulesExportFile(
  fileName: string,
  format: RuleExportFormat,
  content: string
) {
  const baseName = fileName.replace(/\.[^/.]+$/, "")
  const isJson = format === "json"
  const blob = new Blob([content], {
    type: isJson ? "application/json" : "text/plain",
  })
  const url = URL.createObjectURL(blob)

  const link = document.createElement("a")
  link.href = url
  link.download = isJson
    ? `vitalex-rules-${baseName}.json`
    : `vitalex-rules-${baseName}-${format}.txt`
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  URL.revokeObjectURL(url)
}

export default function DocumentDetailPage() {
  const params = useParams<{ id: string }>()
  const router = useRouter()
  const id = params?.id

  const [authChecked, setAuthChecked] = useState(false)
  const [doc, setDoc] = useState<DocumentRow | null>(null)
  const [rules, setRules] = useState<GeneratedRule[]>([])
  const [loading, setLoading] = useState(true)
  const [message, setMessage] = useState("")
  const [showFullText, setShowFullText] = useState(false)
  const [exportingFormat, setExportingFormat] = useState<
    RuleExportFormat | null
  >(null)
  const [exportMessage, setExportMessage] = useState("")
  const [approvalStatusInput, setApprovalStatusInput] = useState("draft")
  const [approvalNotesInput, setApprovalNotesInput] = useState("")
  const [approvalUpdating, setApprovalUpdating] = useState(false)
  const [approvalMessage, setApprovalMessage] = useState("")
  const [profile, setProfile] = useState<{ role: string } | null>(null)

  async function updateApprovalStatus() {
    if (!doc) return

    try {
      setApprovalUpdating(true)
      setApprovalMessage("")

      const response = await fetch(`/api/documents/${doc.id}/approval`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          approvalStatus: approvalStatusInput,
          approvalNotes: approvalNotesInput,
        }),
      })

      const result = await response.json()

      if (!response.ok) {
        setApprovalMessage(
          result.error || "Failed to update approval status."
        )
        return
      }

      setDoc(result.document)
      setApprovalNotesInput(result.document?.approval_notes || "")
      setApprovalMessage("Approval status updated successfully.")
    } catch {
      setApprovalMessage("Failed to update approval status.")
    } finally {
      setApprovalUpdating(false)
    }
  }

  async function exportRulesInFormat(
    documentToExport: DocumentRow,
    format: RuleExportFormat
  ) {
    try {
      setExportingFormat(format)
      setExportMessage(`Exporting ${ruleExportFormatLabels[format]}...`)

      const response = await fetch(
        `/api/documents/${documentToExport.id}/export-rules`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ exportFormat: format }),
        }
      )

      const result = await response.json()

      if (!response.ok) {
        setExportMessage(
          result.error ||
            `Failed to export ${ruleExportFormatLabels[format]}.`
        )
        return
      }

      downloadRulesExportFile(
        documentToExport.file_name,
        format,
        result.content || ""
      )
      setExportMessage(
        `${ruleExportFormatLabels[format]} export downloaded successfully.`
      )
    } catch {
      setExportMessage(`Failed to export ${ruleExportFormatLabels[format]}.`)
    } finally {
      setExportingFormat(null)
    }
  }

  async function fetchProfileRole(userId: string) {
    if (profile) return

    const { data, error } = await supabase
      .from("vitalex_profiles")
      .select("role")
      .eq("id", userId)
      .maybeSingle()

    if (error) {
      console.error("Profile fetch error:", error)
      return
    }

    if (data) {
      setProfile(data)
    }
  }

  useEffect(() => {
    async function checkAuth() {
      const { data } = await supabase.auth.getSession()

      if (!data.session) {
        router.push("/login")
        return
      }

      await fetchProfileRole(data.session.user.id)

      setAuthChecked(true)
    }

    checkAuth()
  }, [router])

  async function handleLogout() {
    await supabase.auth.signOut()
    router.push("/login")
  }

  useEffect(() => {
    if (!id) return

    async function fetchDocument() {
      setLoading(true)
      setMessage("")

      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser()

      if (userError || !user) {
        router.push("/login")
        return
      }

      const { data: docData, error: docError } = await supabase
        .from("vitalex_documents")
        .select("*")
        .eq("id", id)
        .eq("user_id", user.id)
        .single()

      if (docError || !docData) {
        setMessage(docError?.message || "Document not found.")
        setDoc(null)
        setLoading(false)
        return
      }

      setDoc(docData)
      setApprovalStatusInput(docData.approval_status || "draft")
      setApprovalNotesInput(docData.approval_notes || "")

      try {
        const response = await fetch("/api/rules")
        const result = await response.json()

        if (response.ok) {
          const documentRules = (result.rules || [])
            .filter(
              (row: { document_id: string; user_id?: string | null }) =>
                row.document_id === id &&
                (row.user_id === undefined || row.user_id === user.id)
            )
            .map((row: { rule_json: GeneratedRule }) => row.rule_json)

          setRules(documentRules)
        }
      } catch {
        // Non-fatal: the document itself still renders without rules.
      }

      setLoading(false)
    }

    fetchDocument()
  }, [id, router])

  const permissions = getRolePermissions(profile?.role)

  if (!authChecked) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-black text-white">
        <div className="text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-zinc-500">
            Vitalex
          </p>
          <p className="mt-3 text-sm text-zinc-400">Checking authentication...</p>
        </div>
      </main>
    )
  }

  return (
    <main className="relative min-h-screen bg-black text-white">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-0 h-72 opacity-[0.08]"
        style={{
          backgroundImage:
            "linear-gradient(to right, rgba(255,255,255,0.5) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,0.5) 1px, transparent 1px)",
          backgroundSize: "44px 44px",
          maskImage:
            "radial-gradient(ellipse 70% 60% at 50% 0%, black 20%, transparent 80%)",
        }}
      />

      <header className="sticky top-0 z-40 border-b border-zinc-900/80 bg-black/80 backdrop-blur-md">
        <div className="mx-auto flex max-w-4xl flex-wrap items-center justify-between gap-4 px-6 py-4 sm:px-8">
          <Link
            href="/dashboard"
            className="text-sm font-medium text-zinc-400 transition hover:text-white"
          >
            ← Back to Dashboard
          </Link>

          <div className="flex flex-wrap items-center gap-2">
            {profile && (
              <span className={headerButtonClassName}>
                Role: {roleLabels[profile.role] || profile.role}
              </span>
            )}
            <button onClick={handleLogout} className={headerButtonClassName}>
              Logout
            </button>
          </div>
        </div>
      </header>

      <div className="relative mx-auto max-w-4xl px-6 py-10 sm:px-8">
        {loading && (
          <div className={`${sectionCardClassName} mt-6 px-6 py-10 text-center`}>
            <p className="text-sm text-zinc-400">Loading document...</p>
          </div>
        )}

        {!loading && !doc && (
          <div className={`${sectionCardClassName} mt-6 p-6 sm:p-7`}>
            <p className="text-sm text-zinc-300">
              {message || "This document could not be found."}
            </p>
          </div>
        )}

        {!loading && doc && (
          <div className="mt-6 grid gap-6">
            <div className={`${sectionCardClassName} p-6 sm:p-7`}>
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-zinc-500">
                Document Detail
              </p>
              <h1 className="mt-2 break-words text-3xl font-bold tracking-tight text-white">
                {doc.file_name}
              </h1>

              <div className="mt-5 flex flex-wrap gap-2">
                <span className="rounded-full border border-zinc-700/80 px-3 py-1 text-xs text-zinc-300">
                  {doc.document_type || "Unknown type"}
                </span>
                <span className="rounded-full border border-zinc-700/80 px-3 py-1 text-xs text-zinc-300">
                  Payer: {doc.payer || "None"}
                </span>
                <span className="rounded-full border border-zinc-700/80 px-3 py-1 text-xs text-zinc-300">
                  Department: {doc.department || "None"}
                </span>
                <span className="rounded-full bg-zinc-800/80 px-3 py-1 text-xs capitalize text-zinc-300">
                  {doc.status}
                </span>
                <span
                  className={`rounded-full border px-3 py-1 text-xs ${
                    approvalStatusBadgeStyles[
                      doc.approval_status || "draft"
                    ] || "border-zinc-700 text-zinc-300"
                  }`}
                >
                  {approvalStatusLabels[doc.approval_status || "draft"] ||
                    "Draft"}
                </span>
              </div>

              <p className="mt-4 text-sm text-zinc-500">
                Uploaded {new Date(doc.created_at).toLocaleString()}
              </p>
            </div>

            <div className={`${sectionCardClassName} p-6 sm:p-7`}>
              <div>
                <h2 className="text-lg font-semibold text-white">
                  Approval Workflow
                </h2>
                <p className="mt-1 text-sm text-zinc-500">
                  Review and update document approval status
                </p>
              </div>

              <div className="mt-5 flex flex-wrap gap-2">
                <span className="rounded-full border border-zinc-700/80 px-3 py-1 text-xs text-zinc-300">
                  Status:{" "}
                  {approvalStatusLabels[doc.approval_status || "draft"] ||
                    "Draft"}
                </span>
                {doc.approved_at && (
                  <span className="rounded-full border border-zinc-700/80 px-3 py-1 text-xs text-zinc-300">
                    Approved: {new Date(doc.approved_at).toLocaleString()}
                  </span>
                )}
                {doc.published_at && (
                  <span className="rounded-full border border-zinc-700/80 px-3 py-1 text-xs text-zinc-300">
                    Published: {new Date(doc.published_at).toLocaleString()}
                  </span>
                )}
              </div>

              {permissions.canUpdateApproval ? (
                <>
                  <div className="mt-5 grid gap-4 md:grid-cols-2">
                    <div>
                      <label className="mb-2 block text-xs font-medium uppercase tracking-wide text-zinc-500">
                        Approval status
                      </label>
                      <select
                        value={approvalStatusInput}
                        onChange={(e) =>
                          setApprovalStatusInput(e.target.value)
                        }
                        className={inputClassName}
                      >
                        {APPROVAL_STATUS_OPTIONS.map((option) => (
                          <option key={option.value} value={option.value}>
                            {option.label}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="mb-2 block text-xs font-medium uppercase tracking-wide text-zinc-500">
                        Approval notes
                      </label>
                      <textarea
                        value={approvalNotesInput}
                        onChange={(e) =>
                          setApprovalNotesInput(e.target.value)
                        }
                        placeholder="Optional notes about this approval decision"
                        rows={3}
                        className={inputClassName}
                      />
                    </div>
                  </div>

                  <button
                    onClick={updateApprovalStatus}
                    disabled={approvalUpdating}
                    className={`mt-4 ${primaryButtonClassName}`}
                  >
                    {approvalUpdating ? "Updating..." : "Update Status"}
                  </button>
                </>
              ) : (
                <div className="mt-5 rounded-xl border border-dashed border-zinc-800 bg-black/30 px-4 py-5">
                  <p className="text-sm text-zinc-400">
                    Your role does not allow updating approval status.
                  </p>
                </div>
              )}

              {approvalMessage && (
                <p className="mt-4 rounded-xl border border-zinc-800/80 bg-black/40 px-4 py-3 text-sm text-zinc-300">
                  {approvalMessage}
                </p>
              )}
            </div>

            <div className={`${sectionCardClassName} p-6 sm:p-7`}>
              <div>
                <h2 className="text-lg font-semibold text-white">Summary</h2>
                <p className="mt-1 text-sm text-zinc-500">
                  AI-generated overview of this document
                </p>
              </div>
              {doc.summary ? (
                <div className="mt-5 rounded-xl border border-zinc-800/80 bg-black/50 p-5">
                  <p className="whitespace-pre-line text-sm leading-7 text-zinc-300">
                    {doc.summary}
                  </p>
                </div>
              ) : (
                <div className="mt-5 rounded-xl border border-dashed border-zinc-800 bg-black/30 px-4 py-8 text-center">
                  <p className="text-sm text-zinc-400">
                    No summary has been generated for this document yet.
                  </p>
                </div>
              )}
            </div>

            <div className={`${sectionCardClassName} p-6 sm:p-7`}>
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div>
                  <h2 className="text-lg font-semibold text-white">
                    Generated Rules
                  </h2>
                  <p className="mt-1 text-sm text-zinc-500">
                    Structured rules extracted from this document
                  </p>
                </div>
                {rules.length > 0 && permissions.canExportRules && (
                  <div className="flex flex-wrap items-center gap-2">
                    <button
                      onClick={() => exportRulesInFormat(doc, "json")}
                      disabled={exportingFormat !== null}
                      className={secondaryButtonClassName}
                    >
                      {exportingFormat === "json"
                        ? "Exporting..."
                        : "Export JSON"}
                    </button>
                    <button
                      onClick={() => exportRulesInFormat(doc, "pseudocode")}
                      disabled={exportingFormat !== null}
                      className={secondaryButtonClassName}
                    >
                      {exportingFormat === "pseudocode"
                        ? "Exporting..."
                        : "Export Pseudocode"}
                    </button>
                    <button
                      onClick={() => exportRulesInFormat(doc, "sql")}
                      disabled={exportingFormat !== null}
                      className={secondaryButtonClassName}
                    >
                      {exportingFormat === "sql"
                        ? "Exporting..."
                        : "Export SQL"}
                    </button>
                    <button
                      onClick={() => exportRulesInFormat(doc, "python")}
                      disabled={exportingFormat !== null}
                      className={secondaryButtonClassName}
                    >
                      {exportingFormat === "python"
                        ? "Exporting..."
                        : "Export Python"}
                    </button>
                  </div>
                )}
                {rules.length > 0 && !permissions.canExportRules && (
                  <p className="text-sm text-zinc-400">
                    Your role does not allow exporting rules.
                  </p>
                )}
              </div>

              {exportMessage && (
                <p className="mt-4 rounded-xl border border-zinc-800/80 bg-black/40 px-4 py-3 text-sm text-zinc-400">
                  {exportMessage}
                </p>
              )}

              {rules.length > 0 ? (
                <div className="mt-5 grid gap-3">
                  {rules.map((rule, index) => (
                    <div
                      key={`${rule.rule_id}-${index}`}
                      className="rounded-xl border border-zinc-800/80 bg-black/50 p-4 transition hover:border-zinc-700/80"
                    >
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <span className="text-sm font-semibold text-white">
                          {rule.rule_id} — {rule.title}
                        </span>
                        <div className="flex items-center gap-2">
                          <span className="rounded-full border border-zinc-700/80 px-3 py-1 text-xs text-zinc-300">
                            {rule.department}
                          </span>
                          <span
                            className={`rounded-full border px-3 py-1 text-xs ${
                              riskBadgeStyles[
                                rule.risk_level?.toLowerCase()
                              ] || "border-zinc-700 text-zinc-300"
                            }`}
                          >
                            {rule.risk_level} risk
                          </span>
                        </div>
                      </div>

                      <p className="mt-3 text-sm leading-6 text-zinc-300">
                        <span className="font-medium text-zinc-400">
                          If:{" "}
                        </span>
                        {rule.condition}
                      </p>
                      <p className="mt-1 text-sm leading-6 text-zinc-300">
                        <span className="font-medium text-zinc-400">
                          Then:{" "}
                        </span>
                        {rule.action}
                      </p>
                      <p className="mt-2 text-xs text-zinc-500">
                        Source: {rule.source_reference}
                      </p>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="mt-5 rounded-xl border border-dashed border-zinc-800 bg-black/30 px-4 py-8 text-center">
                  <p className="text-sm text-zinc-400">
                    No rules have been generated for this document yet.
                  </p>
                </div>
              )}
            </div>

            <div className={`${sectionCardClassName} p-6 sm:p-7`}>
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div>
                  <h2 className="text-lg font-semibold text-white">
                    {showFullText
                      ? "Extracted Text (Full)"
                      : "Extracted Text Preview"}
                  </h2>
                  <p className="mt-1 text-sm text-zinc-500">
                    Raw text extracted from the uploaded file
                  </p>
                </div>

                {doc.extracted_text &&
                  doc.extracted_text.length > EXTRACTED_TEXT_PREVIEW_LENGTH && (
                    <button
                      onClick={() => setShowFullText((prev) => !prev)}
                      className={secondaryButtonClassName}
                    >
                      {showFullText ? "Show Preview" : "View Full Text"}
                    </button>
                  )}
              </div>

              {doc.extracted_text ? (
                <>
                  <div className="mt-5 max-h-[28rem] overflow-y-auto rounded-xl border border-zinc-800/80 bg-black/50 p-5">
                    <p className="whitespace-pre-line font-mono text-sm leading-7 text-zinc-300">
                      {showFullText
                        ? doc.extracted_text
                        : doc.extracted_text.slice(
                            0,
                            EXTRACTED_TEXT_PREVIEW_LENGTH
                          ) +
                          (doc.extracted_text.length >
                          EXTRACTED_TEXT_PREVIEW_LENGTH
                            ? "..."
                            : "")}
                    </p>
                  </div>
                  {!showFullText &&
                    doc.extracted_text.length >
                      EXTRACTED_TEXT_PREVIEW_LENGTH && (
                      <p className="mt-3 text-xs text-zinc-500">
                        Showing first 3,000 characters of extracted text.
                      </p>
                    )}
                </>
              ) : (
                <div className="mt-5 rounded-xl border border-dashed border-zinc-800 bg-black/30 px-4 py-8 text-center">
                  <p className="text-sm text-zinc-400">
                    No extracted text is available for this document yet.
                  </p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </main>
  )
}
