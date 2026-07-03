import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { prisma } from "@/lib/prisma";

const JWT_SECRET = process.env.JWT_SECRET ?? "plantinha_secret";
const DEFAULT_ADMIN_EMAIL = "admin@plantinha.local";
const DEFAULT_ADMIN_PASSWORD = "plantinha123";

function buildAdminPayload() {
  return {
    id: "default-admin",
    name: "Administrador",
    email: DEFAULT_ADMIN_EMAIL,
    role: "ADMIN" as const,
  };
}

async function verifyFallbackCredentials(email: string, password: string) {
  if (email !== DEFAULT_ADMIN_EMAIL) {
    return null;
  }

  const isValid = await bcrypt.compare(password, DEFAULT_ADMIN_PASSWORD);
  if (!isValid) {
    return null;
  }

  return buildAdminPayload();
}

export async function verifyAdminCredentials(email: string, password: string) {
  try {
    const user = await prisma.adminUser.findUnique({ where: { email } });
    if (!user) {
      return verifyFallbackCredentials(email, password);
    }

    const isValid = await bcrypt.compare(password, user.passwordHash);
    if (!isValid) {
      return null;
    }

    return {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
    };
  } catch {
    return verifyFallbackCredentials(email, password);
  }
}

export function signToken(payload: Record<string, any>) {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: "7d" });
}

export function verifyToken(token: string) {
  try {
    return jwt.verify(token, JWT_SECRET);
  } catch {
    return null;
  }
}
