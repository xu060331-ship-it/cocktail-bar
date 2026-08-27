const fs = require("fs")
const crypto = require("crypto")
const file = process.argv[2]
if (!file || !fs.existsSync(file)) { console.error("用法: node verify-backup.js <backup.sql.gz>"); process.exit(1) }
const hash = crypto.createHash("sha256").update(fs.readFileSync(file)).digest("hex")
const checksum = `${file}.sha256`
const expected = fs.existsSync(checksum) ? fs.readFileSync(checksum, "utf8").trim().split(/\s+/)[0] : ""
console.log(expected && expected === hash ? "备份校验通过" : `SHA-256: ${hash}${expected ? `\n清单中的值: ${expected}` : "\n未找到校验清单"}`)
process.exitCode = expected && expected === hash ? 0 : 1
