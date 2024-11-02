export interface Asset {
  id: string;
  name: string;
  description: string;
  owner_id: string;
  created_at: string;
}

export interface Transaction {
  id: string;
  asset_id: string;
  from_user_id: string;
  to_user_id: string;
  transaction_type: string;
  created_at: string;
  from_user?: {
    id: string;
    email: string;
  };
  to_user?: {
    id: string;
    email: string;
  };
} 