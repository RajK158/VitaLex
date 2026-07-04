import { NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"

export const runtime = "nodejs"

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

const supabase = createClient(supabaseUrl, serviceRoleKey)

async function getUserIdFromRequest(request: Request): Promise<string | null> {
  const authHeader = request.headers.get("authorization")
  const accessToken = authHeader?.toLowerCase().startsWith("bearer ")
    ? authHeader.slice(7)
    : null

  if (!accessToken) return null

  const { data, error } = await supabase.auth.getUser(accessToken)

  if (error || !data.user) return null

  return data.user.id
}

export async function DELETE(
  request: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params
    const userId = await getUserIdFromRequest(request)

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { data: document, error: documentError } = await supabase
      .from("vitalex_documents")
      .select("*")
      .eq("id", id)
      .eq("user_id", userId)
      .single()

    if (documentError || !document) {
      return NextResponse.json(
        { error: "Document not found" },
        { status: 404 }
      )
    }

    const { error: storageError } = await supabase.storage
      .from("documents")
      .remove([document.file_path])

    if (storageError) {
      return NextResponse.json(
        { error: storageError.message },
        { status: 500 }
      )
    }

    const { error: deleteError } = await supabase
      .from("vitalex_documents")
      .delete()
      .eq("id", id)
      .eq("user_id", userId)

    if (deleteError) {
      return NextResponse.json(
        { error: deleteError.message },
        { status: 500 }
      )
    }

    try {
      const { error: auditError } = await supabase
        .from("vitalex_audit_logs")
        .insert({
          action: "deleted_document",
          entity_type: "document",
          entity_id: id,
          user_id: userId,
          metadata: { file_name: document.file_name || null },
        })

      if (auditError) {
        console.error("Failed to write audit log:", auditError.message)
      }
    } catch (auditException) {
      console.error("Failed to write audit log:", auditException)
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Something went wrong"

    return NextResponse.json({ error: message }, { status: 500 })
  }
}
