# College Data Pipeline

The app currently ships with a broad seed dataset in `src/lib/predictor.ts` so Vercel can build without a database.

For production-grade yearly updates, import official JoSAA/CSAB CSV exports into normalized JSON or Prisma tables:

```bash
node scripts/import-cutoffs.mjs ./data/josaa-2024-round-6.csv src/data/imported-cutoffs.json
```

Expected source columns can use common JoSAA names:

- `Institute` or `Institute Name`
- `Academic Program Name` or `Branch`
- `Quota`
- `Seat Type`
- `Gender`
- `Opening Rank`
- `Closing Rank`
- `Year`
- `Round`

Primary sources to use for replacement imports:

- JoSAA opening and closing rank tables: `josaa.nic.in`
- CSAB special round opening and closing rank tables: `csab.nic.in`
- Official college placement pages and annual reports
- Public Kaggle JoSAA datasets only as a convenience mirror when the license allows redistribution

The Prisma schema in `prisma/schema.prisma` is ready for a Postgres-backed version when `DATABASE_URL` is available.
