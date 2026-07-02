import { NextResponse } from "next/server";
import { verifyAdminCredentials, signToken } from "@/lib/auth";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email, password } = body;

    if (!email || !password) {
      return NextResponse.json({ error: "Email e senha são necessários." }, { status: 400 });
    }

    const user = await verifyAdminCredentials(email, password);

    if (!user) {
      return NextResponse.json({ error: "Credenciais inválidas." }, { status: 401 });
    }

    const token = signToken({ id: user.id, email: user.email, role: user.role });

    const response = NextResponse.json({ success: true });
    response.cookies.set("plantinha_token", token, {
      httpOnly: true,
      path: "/",
      maxAge: 60 * 60 * 24 * 7,
    });

    return response;
  } catch {
    return NextResponse.json({ error: "Servico temporariamente indisponivel. Tente novamente." }, { status: 503 });
  }
}
