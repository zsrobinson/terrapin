# Simple Student Org

## Dev Commands

```bash
# Generate Auth Schema
npx auth@rc generate --output ./src/db/auth-schema.ts

# Generate DB migration files
npm run db:generate

# Execute Cloudflare D1 Migration
npx wrangler d1 migrations list simplestudentorg
npx wrangler d1 migrations apply simplestudentorg
```
