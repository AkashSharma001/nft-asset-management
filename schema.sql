-- Enable UUID extension if not already enabled
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Users table
CREATE TABLE users (
  id uuid DEFAULT uuid_generate_v4() PRIMARY KEY,
  email text UNIQUE NOT NULL,
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Assets table
CREATE TABLE assets (
  id uuid DEFAULT uuid_generate_v4() PRIMARY KEY,
  name text NOT NULL,
  description text,
  owner_id uuid NOT NULL,
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
  CONSTRAINT fk_owner FOREIGN KEY (owner_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Transactions table (blockchain simulation)
CREATE TABLE transactions (
  id uuid DEFAULT uuid_generate_v4() PRIMARY KEY,
  asset_id uuid NOT NULL,
  from_user_id uuid,  -- Allow NULL for initial minting
  to_user_id uuid NOT NULL,
  transaction_type text NOT NULL,
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
  -- Add constraints to ensure referential integrity
  CONSTRAINT fk_asset FOREIGN KEY (asset_id) REFERENCES assets(id) ON DELETE CASCADE,
  CONSTRAINT fk_from_user FOREIGN KEY (from_user_id) REFERENCES users(id) ON DELETE SET NULL,
  CONSTRAINT fk_to_user FOREIGN KEY (to_user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Create indexes for better query performance
CREATE INDEX idx_assets_owner_id ON assets(owner_id);
CREATE INDEX idx_transactions_asset_id ON transactions(asset_id);
CREATE INDEX idx_transactions_from_user_id ON transactions(from_user_id);
CREATE INDEX idx_transactions_to_user_id ON transactions(to_user_id);

-- Add the transfer_asset_with_validation function
CREATE OR REPLACE FUNCTION public.transfer_asset_with_validation(
  p_asset_id UUID,
  p_from_user_id UUID,
  p_to_user_id UUID
) RETURNS BOOLEAN AS $$
DECLARE
  v_current_owner_id UUID;
BEGIN
  -- Prevent self-transfer
  IF p_from_user_id = p_to_user_id THEN
    RAISE EXCEPTION 'Cannot transfer asset to yourself';
  END IF;

  -- Get current owner of the asset
  SELECT owner_id INTO v_current_owner_id
  FROM assets
  WHERE id = p_asset_id
  FOR UPDATE;  -- Lock the row to prevent concurrent transfers

  -- Validate ownership
  IF v_current_owner_id IS NULL THEN
    RAISE EXCEPTION 'Asset not found';
  END IF;

  IF v_current_owner_id != p_from_user_id THEN
    RAISE EXCEPTION 'Sender does not own this asset';
  END IF;

  -- Update asset ownership
  UPDATE assets
  SET owner_id = p_to_user_id
  WHERE id = p_asset_id;

  -- Record the transaction
  INSERT INTO transactions (
    asset_id,
    from_user_id,
    to_user_id,
    transaction_type
  ) VALUES (
    p_asset_id,
    p_from_user_id,
    p_to_user_id,
    'TRANSFER'
  );

  RETURN TRUE;
EXCEPTION
  WHEN OTHERS THEN
    -- Roll back any changes and re-raise the error
    RAISE;
END;
$$ LANGUAGE plpgsql VOLATILE;

-- Add a comment to explain the function
COMMENT ON FUNCTION public.transfer_asset_with_validation IS 
'Transfers an asset from one user to another, validating ownership and recording the transaction.
Returns true on success, raises an exception on failure.';