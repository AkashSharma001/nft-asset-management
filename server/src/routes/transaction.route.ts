import { t } from '../trpc';
import { z } from 'zod';
import { TRPCError } from '@trpc/server';
import { supabase } from '../services/supabase';
import { Transaction } from '../types/nft.types';

// Handles NFT asset transfers and transaction history
export const transactionRouter = t.router({
  // Transfer asset ownership with validation
  transferAsset: t.procedure
    .input(z.object({
      assetId: z.string().uuid("Invalid asset ID"),
      recipientEmail: z
        .string()
        .min(1, "Email is required")
        .email("Please enter a valid email address")
    }))
    .mutation(async ({ input }) => {
      try {
        const { assetId, recipientEmail } = input;

        // Validate recipient exists
        const { data: recipientUser, error: userError } = await supabase
          .from('users')
          .select('id')
          .eq('email', recipientEmail)
          .single();

        if (userError || !recipientUser) {
          throw new TRPCError({
            code: 'NOT_FOUND',
            message: 'Recipient user not found',
          });
        }

        const { data: result, error: txError } = await supabase.rpc('transfer_asset_with_validation', {
          p_asset_id: assetId,
          p_from_user_id: recipientUser.id,
          p_to_user_id: recipientUser.id
        });

        if (txError) {
          throw new TRPCError({
            code: 'INTERNAL_SERVER_ERROR',
            message: txError.message,
          });
        }

        return result;
      } catch (error) {
        if (error instanceof TRPCError) throw error;
        
        throw new TRPCError({
          code: 'BAD_REQUEST',
          message: error instanceof Error ? error.message : 'Failed to transfer asset',
        });
      }
    }),

  // Retrieve transaction history for a specific asset
  getAssetHistory: t.procedure
    .input(z.object({ assetId: z.string().uuid() }))
    .query(async ({ input: { assetId } }): Promise<Transaction[]> => {
      const { data, error } = await supabase
        .from('transactions')
        .select(`
          *,
          from_user:from_user_id(id, email),
          to_user:to_user_id(id, email)
        `)
        .eq('asset_id', assetId)
        .order('created_at', { ascending: false });

      if (error) {
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: error.message,
        });
      }

      return data || [];
    })
}); 