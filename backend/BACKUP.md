# 数据库备份

备份依赖 PostgreSQL 客户端工具 `pg_dump`、`psql`。服务器上先确认：

```bash
pg_dump --version
psql --version
```

手动执行一次备份：

```bash
cd backend
BACKUP_RETENTION_DAYS=14 npm run backup
```

备份默认保存到 `backend/backups/`，文件权限为仅当前用户可读，并生成 `.sha256` 校验文件。建议使用阿里云服务器的 cron 每天执行，例如每天凌晨 3 点：

```cron
0 3 * * * cd /path/to/cocktail-project/backend && /usr/bin/node backup-database.js >> /var/log/cocktail-backup.log 2>&1
```

验证备份：

```bash
npm run verify-backup -- backups/cocktail_bar-xxxx.sql.gz
```

恢复前必须明确设置 `ALLOW_DATABASE_RESTORE=true`，避免误执行：

```bash
ALLOW_DATABASE_RESTORE=true npm run restore -- backups/cocktail_bar-xxxx.sql.gz
```

恢复应在维护窗口执行，并先把当前数据库再次备份。异地备份建议使用阿里云 OSS 或另一台服务器，完成后再把备份目录复制到远程位置；不要把备份提交到 Git，也不要把数据库密码写入命令或日志。
