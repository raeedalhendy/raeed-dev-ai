This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

Configure `DATABASE_URL` using `.env.example` and initialize the database with
`database/schema.sql`. Products, categories, images, prices, and the exchange
rate are loaded from the database in both development and production.
There is no sample-catalog fallback. Manage catalog content and the exchange
rate through the dashboard.

## Product and category URLs

The dashboard generates a readable public URL from the name (Arabic or English).
Use **توليد من الاسم** to regenerate it or edit **رابط الصفحة** manually. Automatic
duplicates receive `-2`, `-3`, etc.; custom duplicates show a validation error.
Changing the display name alone does not rename an existing page.

URL edits preserve immutable internal slugs, category relationships and cart IDs.
All former URLs remain reserved and redirect directly to the latest public URL.
Redirects are temporary to avoid cached redirect loops when returning to an old URL.
Deleted items return 404; their old links cannot be reassigned to another item.

The first authenticated catalog save runs the additive migration automatically.
If the database role cannot alter tables, run
`database/migration-005-catalog-urls.sql` in Neon's SQL editor. No new Vercel
environment variables are needed. Existing catalog reads work before migration.

## Programming services

In **Dashboard → Products → Add product**, choose **خدمة برمجية** as the product
type, then choose websites, applications, or subscription/game stores. Select
fixed pricing, a starting price, or a custom quote. Add the estimated delivery
time, scope/deliverables, exclusions, support terms and an optional portfolio
link. Existing products remain digital subscriptions until explicitly changed.

Service pages collect a short project brief and open a pre-filled WhatsApp
message for the customer to review and send. They do not create database orders,
send messages automatically, charge customers, or enter the subscription cart.
Only publish features and support terms you actually provide; no example services
or prices are automatically published.

### Neon and Vercel rollout

- No additional Vercel environment variables, integrations or packages are needed.
  Keep the existing `DATABASE_URL` and authentication configuration.
- The authenticated dashboard automatically adds the nullable
  `products.service_details JSONB` column on the first product save, using the
  same database role already used for image-column upgrades. This role must be
  allowed to alter the products table.
- You can alternatively run `database/migration-004-project-services.sql` once
  in Neon's SQL editor against the database/branch used by the deployed app.
  It is additive and safe to run again; existing products are not modified.
- Catalog reads work before the migration as well, treating products without
  service details as subscriptions. Pushes need a successful deployment on
  Vercel before the new dashboard fields appear.

Run `npm test`, `npm run lint`, and `npm run build` to validate the application.

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

The Arabic storefront uses Tajawal, RTL layouts, and scoped styles in
`app/storefront.module.css`. Motion respects the visitor's reduced-motion setting.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
