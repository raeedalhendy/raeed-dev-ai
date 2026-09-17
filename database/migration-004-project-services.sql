-- Safe to run more than once. Existing products stay digital subscriptions.
-- The dashboard also adds this column automatically on the first product save.
ALTER TABLE products ADD COLUMN IF NOT EXISTS service_details JSONB;
