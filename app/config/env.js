import dotenv from "dotenv";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const envPath = resolve(dirname(fileURLToPath(import.meta.url)), "../../.env");
const isRailway = Boolean(
    process.env.RAILWAY_ENVIRONMENT ||
    process.env.RAILWAY_PROJECT_ID ||
    process.env.MYSQLHOST
);

if (process.env.NODE_ENV !== "production" && !isRailway) {
    dotenv.config({ path: envPath, override: true, quiet: true });
}
