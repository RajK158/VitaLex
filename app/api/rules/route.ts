import { NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"

export const runtime = "nodejs"

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

const supabase = createClient(supabaseUrl, serviceRoleKey)

export async function GET() {
  try {
    const { data, error } = await supabase
      .from("vitalex_rules")
      .select("document_id, rule_json")
      .order("created_at", { ascending: true })

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ rules: data || [] })
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Something went wrong"

    return NextResponse.json({ error: message }, { status: 500 })
  }
}
