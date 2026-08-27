require("dotenv").config()
const fs = require("fs")
const path = require("path")
const { spawn } = require("child_process")
const zlib = require("zlib")
const backup = process.argv[2]
if (!backup || !fs.existsSync(path.resolve(backup))) { console.error("用法: node restore-database.js <backup.sql.gz>"); process.exit(1) }
if (process.env.ALLOW_DATABASE_RESTORE !== "true") { console.error("恢复是破坏性操作。请先设置 ALLOW_DATABASE_RESTORE=true"); process.exit(1) }
const databaseUrl = process.env.DATABASE_URL || "postgresql://postgres:tony0331@localhost:5432/cocktail_bar"
const restore = spawn(process.env.PSQL_PATH || "psql", [databaseUrl, "--single-transaction"], { stdio: ["pipe", "inherit", "inherit"] })
fs.createReadStream(path.resolve(backup)).pipe(zlib.createGunzip()).pipe(restore.stdin)
restore.on("close", (code) => { if (code === 0) console.log("数据库恢复完成") ; else console.error(`数据库恢复失败，退出码: ${code}`); process.exitCode = code || 0 })
