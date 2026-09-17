const Database = require("better-sqlite3");
const db = new Database("vehicle-life.sqlite");

db.pragma("journal_mode = WAL");

db.exec(`
CREATE TABLE IF NOT EXISTS users (
  user_id TEXT PRIMARY KEY,
  guild_id TEXT NOT NULL,
  messages INTEGER NOT NULL DEFAULT 0,
  vc_seconds INTEGER NOT NULL DEFAULT 0,
  vehicle_index INTEGER NOT NULL DEFAULT 0,
  last_vc_join INTEGER,
  updated_at INTEGER NOT NULL DEFAULT (strftime('%s','now'))
);

CREATE INDEX IF NOT EXISTS idx_users_guild ON users(guild_id);
`);

function ensureUser(userId, guildId) {
  db.prepare(`
    INSERT INTO users(user_id, guild_id)
    VALUES(?, ?)
    ON CONFLICT(user_id) DO NOTHING
  `).run(userId, guildId);
}

function getUser(userId, guildId) {
  ensureUser(userId, guildId);
  return db.prepare("SELECT * FROM users WHERE user_id = ? AND guild_id = ?")
    .get(userId, guildId);
}

function addMessage(userId, guildId) {
  ensureUser(userId, guildId);
  db.prepare(`
    UPDATE users SET messages = messages + 1, updated_at = unixepoch()
    WHERE user_id = ? AND guild_id = ?
  `).run(userId, guildId);
}

function addVcSeconds(userId, guildId, seconds) {
  if (!Number.isFinite(seconds) || seconds <= 0) return;
  ensureUser(userId, guildId);
  db.prepare(`
    UPDATE users SET vc_seconds = vc_seconds + ?, updated_at = unixepoch()
    WHERE user_id = ? AND guild_id = ?
  `).run(Math.floor(seconds), userId, guildId);
}

function setVcJoin(userId, guildId, timestamp) {
  ensureUser(userId, guildId);
  db.prepare(`
    UPDATE users SET last_vc_join = ?, updated_at = unixepoch()
    WHERE user_id = ? AND guild_id = ?
  `).run(timestamp, userId, guildId);
}

function clearVcJoin(userId, guildId) {
  ensureUser(userId, guildId);
  db.prepare(`
    UPDATE users SET last_vc_join = NULL, updated_at = unixepoch()
    WHERE user_id = ? AND guild_id = ?
  `).run(userId, guildId);
}

function setVehicleIndex(userId, guildId, index) {
  ensureUser(userId, guildId);
  db.prepare(`
    UPDATE users SET vehicle_index = ?, updated_at = unixepoch()
    WHERE user_id = ? AND guild_id = ?
  `).run(index, userId, guildId);
}

function topUsers(guildId, limit = 10) {
  return db.prepare(`
    SELECT * FROM users
    WHERE guild_id = ?
    ORDER BY vehicle_index DESC, vc_seconds DESC, messages DESC
    LIMIT ?
  `).all(guildId, limit);
}

module.exports = {
  db,
  ensureUser,
  getUser,
  addMessage,
  addVcSeconds,
  setVcJoin,
  clearVcJoin,
  setVehicleIndex,
  topUsers
};