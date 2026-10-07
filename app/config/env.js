import dotenv from "dotenv";

const isRailway = Boolean(
    process.env.RAILWAY_ENVIRONMENT ||
    process.env.RAILWAY_PROJECT_ID ||
    process.env.MYSQLHOST
);

if (process.env.NODE_ENV !== "production" && !isRailway) {
    dotenv.config({ path: ".env.example", quiet: true });
    dotenv.config({ override: true, quiet: true });
}
