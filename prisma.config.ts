import { defineConfig, env } from "prisma/config";
import "dotenv/config"

export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
  },
  engine: "classic",
  datasource: {
    url: env("DATABASE_URL", "postgresql://dummy:dummy@localhost:5432/dummy"),
    directUrl: env("DIRECT_URL", "postgresql://dummy:dummy@localhost:5432/dummy")
  },
});
