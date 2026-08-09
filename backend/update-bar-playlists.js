require("dotenv").config()
const { Client } = require("pg")

const db = new Client({
  connectionString: process.env.DATABASE_URL || "postgresql://postgres:tony0331@localhost:5432/cocktail_bar",
  ssl: (process.env.DATABASE_URL || "").includes("localhost") ? false : { rejectUnauthorized: false },
})

async function update() {
  await db.connect()
  console.log("数据库已连接")

  // 吧台材料表
  await db.query(`
    CREATE TABLE IF NOT EXISTS bar_ingredients (
      id SERIAL PRIMARY KEY,
      user_id INT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      ingredient VARCHAR(100) NOT NULL,
      UNIQUE(user_id, ingredient)
    )
  `)
  console.log("bar_ingredients 表已创建")

  // 酒单表
  await db.query(`
    CREATE TABLE IF NOT EXISTS playlists (
      id SERIAL PRIMARY KEY,
      user_id INT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      name VARCHAR(100) NOT NULL,
      description TEXT,
      created_at TIMESTAMP DEFAULT NOW()
    )
  `)
  console.log("playlists 表已创建")

  // 酒单项表
  await db.query(`
    CREATE TABLE IF NOT EXISTS playlist_items (
      id SERIAL PRIMARY KEY,
      playlist_id INT NOT NULL REFERENCES playlists(id) ON DELETE CASCADE,
      cocktail_eng VARCHAR(100) NOT NULL,
      added_at TIMESTAMP DEFAULT NOW(),
      UNIQUE(playlist_id, cocktail_eng)
    )
  `)
  console.log("playlist_items 表已创建")

  await db.end()
  console.log("完成")
}

update().catch(err => { console.error("出错:", err.message); db.end() })
