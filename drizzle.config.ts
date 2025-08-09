import "dotenv/config";
import { defineConfig } from "drizzle-kit";

export default defineConfig({
  out: "./drizzle",
  schema: "./src/db/schema.ts",
  dialect: "postgresql",
  tablesFilter: ["!mastra*"],
  dbCredentials: {
    // url: process.env.DATABASE_URL!,
    url: "postgresql://postgres.ghagosmzvisanynxnift:nvg1epzvsliV0r8W@aws-0-us-east-1.pooler.supabase.com:6543/postgres"
  },
});
