import "dotenv/config";
import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { Pool } from "pg";
import bcrypt from "bcryptjs";

const connectionString = process.env.DATABASE_URL;
const pool = new Pool({ connectionString });
const adapter = new PrismaPg(pool);

const prisma = new PrismaClient({ adapter });

async function main() {
  const adminEmail = "admin@plantinha.local";
  const existing = await prisma.adminUser.findUnique({ where: { email: adminEmail } });

  if (!existing) {
    const passwordHash = await bcrypt.hash("plantinha123", 10);
    await prisma.adminUser.create({
      data: {
        name: "Administrador",
        email: adminEmail,
        passwordHash,
        role: "ADMIN",
      },
    });
    console.log("Admin user created:", adminEmail);
  } else {
    console.log("Admin user already exists");
  }

  const modules = [
    {
      slug: "diario",
      name: "Diário",
      description: "Relatos e lembranças publicadas no nosso diário compartilhado",
      order: 1,
    },
    {
      slug: "declaracoes",
      name: "Declarações",
      description: "Mensagens e declarações especiais",
      order: 2,
    },
    {
      slug: "historias",
      name: "Histórias",
      description: "Histórias e aventuras que vivemos juntos",
      order: 3,
    },
    {
      slug: "desenhos",
      name: "Desenhos",
      description: "Desenhos e artes que você fez para mim",
      order: 4,
    },
    {
      slug: "memoria",
      name: "Memória",
      description: "Jogo da memória com cartas especiais",
      order: 5,
    },
    {
      slug: "recordacao-1-ano",
      name: "Recordação 1 Ano",
      description: "Página especial liberada após o primeiro ano",
      order: 6,
    },
  ];

  for (const module of modules) {
    const existingModule = await prisma.module.findUnique({ where: { slug: module.slug } });

    if (!existingModule) {
      await prisma.module.create({ data: module });
      console.log("Module created:", module.slug);
    }
  }
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
