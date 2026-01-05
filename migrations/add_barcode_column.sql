-- Migration: Add barcode column and fix duplicates
-- Date: 2026-01-04
-- Description: Adds barcode field and ensures product_inventory_view uniqueness

-- 1. Update the main Product table in catalog service
ALTER TABLE product ADD COLUMN IF NOT EXISTS barcode VARCHAR(50);
CREATE UNIQUE INDEX IF NOT EXISTS idx_product_barcode ON product(barcode) WHERE barcode IS NOT NULL;

-- 2. Deduplicate and fix the Product Inventory View table (Read Model)
-- First, remove any existing duplicates, keeping only the record with the highest quantity (or just the latest one)
DELETE FROM product_inventory_view a USING product_inventory_view b
WHERE a.ctid < b.ctid 
  AND a.product_id = b.product_id 
  AND a.store_id = b.store_id;

-- Add Primary Key to prevent future duplicates
-- First, ensure columns are NOT NULL
ALTER TABLE product_inventory_view ALTER COLUMN product_id SET NOT NULL;
ALTER TABLE product_inventory_view ALTER COLUMN store_id SET NOT NULL;

-- Safely drop any existing primary key and add the correct one
DO $$ 
DECLARE 
    pk_name TEXT;
BEGIN 
    -- Find the name of the current primary key if it exists
    SELECT conname INTO pk_name
    FROM pg_constraint 
    WHERE contype = 'p' AND conrelid = 'product_inventory_view'::regclass;

    -- If a primary key already exists, drop it so we can create the correct one
    IF pk_name IS NOT NULL THEN
        EXECUTE 'ALTER TABLE product_inventory_view DROP CONSTRAINT ' || quote_ident(pk_name);
    END IF;

    -- Add the composite primary key (product_id, store_id)
    ALTER TABLE product_inventory_view ADD PRIMARY KEY (product_id, store_id);
END $$;

-- 3. Add missing columns and indices
ALTER TABLE product_inventory_view ADD COLUMN IF NOT EXISTS barcode VARCHAR(50);
CREATE INDEX IF NOT EXISTS idx_inventory_barcode ON product_inventory_view(barcode);
ALTER TABLE product_inventory_view ADD COLUMN IF NOT EXISTS sku VARCHAR(50);

-- Sample data updates are handled by the populate_barcodes.py script
