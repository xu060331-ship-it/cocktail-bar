require("dotenv").config()
const fs = require("fs")
const path = require("path")
const crypto = require("crypto")
const { spawn } = require("child_process")
const zlib = require("zlib")

const backupDir = path.resolve(process.env.BACKUP_DIR || path.join(__dirname, "backups"))
const retentionDays = Math.max(1, Number(process.env.BACKUP_RETENTION_DAYS || 14))
const databaseUrl = process.env.DATABASE_URL || "postgresql://postgres:tony0331@localhost:5432/cocktail_bar"
const stamp = new Date().toISOString().replace(/[:.]/g, "-")
const output = path.join(backupDir, `cocktail_bar-${stamp}.sql.gz`)

function run() {
  fs.mkdirSync(backupDir, { recursive: true })
  const dump = spawn(process.env.PG_DUMP_PATH || "pg_dump", [databaseUrl, "--no-owner", "--no-privileges"], { stdio: ["ignore", "pipe", "pipe"] })
  const gzip = zlib.createGzip({ level: 9 })
  const file = fs.createWriteStream(output, { flags: "wx", mode: 0o600 })
  let error = ""
  dump.stderr.on("data", (chunk) => { error += chunk.toString() })
  dump.stdout.pipe(gzip).pipe(file)
  dump.on("error", (err) => { error += err.message })
  dump.on("close", (code) => {
    if (code !== 0) { file.destroy(); fs.rmSync(output, { force: true }); throw new Error(error || `pg_dump 退出码 ${code}`) }
    file.close(() => {
      const hash = crypto.createHash("sha256").update(fs.readFileSync(output)).digest("hex")
      fs.writeFileSync(`${output}.sha256`, `${hash}  ${path.basename(output)}\n`, { mode: 0o600 })
      const cutoff = Date.now() - retentionDays * 86400000
      for (const name of fs.readdirSync(backupDir)) { const target = path.join(backupDir, name); if ((name.endsWith(".sql.gz") || name.endsWith(".sql.gz.sha256")) && fs.statSync(target).mtimeMs < cutoff) fs.rmSync(target) }
      console.log(`数据库备份完成: ${output}`)
      console.log(`SHA-256: ${hash}`)
    })
  })
}
try { run() } catch (err) { console.error(`数据库备份失败: ${err.message}`); process.exitCode = 1 }
