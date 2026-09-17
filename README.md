# 🚗 Vehicle Life

A Discord activity-to-vehicle collection game.

## Included

- Linear 34-vehicle progression
- VC time tracking
- Message counting
- SQLite persistence
- `/profile`
- `/garage`
- `/topgarages`
- `/setup`
- Automatic unlock announcements
- Separate requirements for every vehicle
- Discord intents for messages, members and voice states

## 1. Install

Install Node.js 20+.

Then:

```bash
npm install
```

## 2. Configure

Copy `.env.example` to `.env`.

Put in:

```env
DISCORD_TOKEN=YOUR_BOT_TOKEN
CLIENT_ID=1549925889997938780
GUILD_ID=YOUR_TEST_SERVER_ID
TOP_GARAGES_CHANNEL_ID=
```

### Important

Never share your bot token with anyone.

## 3. Discord Developer Portal

Bot page → Privileged Gateway Intents:

- Server Members Intent
- Message Content Intent
- Presence Intent

For this bot, the code specifically uses Guilds, Guild Members, Guild Messages, Message Content and Guild Voice States.

## 4. Start

```bash
npm start
```

When you see:

`Vehicle Life is online.`

the bot should show online in Discord.

## 5. Commands

`/profile` — current vehicle, VC, messages and next unlock

`/garage` — complete collection

`/topgarages` — leaderboard

`/setup` — admin helper for the Top Garages channel

## Vehicle images

Place images in:

`assets/vehicles/`

The first version uses Discord embeds so the bot can be tested without native image libraries. The visual PNG card system can be added after the core bot is confirmed working.

## Balance

All vehicle requirements are in:

`src/vehicles.js`

Change the VC hours/messages there without touching the tracking system.
