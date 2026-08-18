# terraPIN

## Dev Commands

```bash
# Generate Auth Schema
npx auth@latest generate --output ./src/db/auth-schema.ts

# Generate DB migration files
npm run db:generate

# Execute Cloudflare D1 Migration
npx wrangler@latest d1 migrations list terrapin
npx wrangler@latest d1 migrations apply terrapin
```
