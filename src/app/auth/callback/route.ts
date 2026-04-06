import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  const plan = searchParams.get("plan");
  const next = searchParams.get("next");

  if (code) {
    const supabase = await createClient();
    const { error } = await supabase.auth.exchangeCodeForSession(code);

    if (!error) {
      // Login flow → redirect to next (default: /mi-cuenta)
      if (next) {
        return NextResponse.redirect(`${origin}${next}`);
      }
      // Registration flow → redirect to billing data
      return NextResponse.redirect(`${origin}/registro/datos?plan=${plan || "monthly"}`);
    }
  }

  return NextResponse.redirect(`${origin}/registro?error=auth`);
}
