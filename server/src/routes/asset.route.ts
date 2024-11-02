import { t } from '../trpc';
import { z } from 'zod';
import { TRPCError } from '@trpc/server';
import { supabase } from '../services/supabase';
import { Asset } from '../types/nft.types';

// Asset management endpoints for NFT operations
export const assetRouter = t.router({
  // Fetch all assets owned by a specific user
  getUserAssets: t.procedure
    .input(z.string().uuid())
    .query(async ({ input: userId }): Promise<Asset[]> => {
      const { data, error } = await supabase
        .from('assets')
        .select('*')
        .eq('owner_id', userId);
      
      if (error) {
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: error.message,
        });
      }
      
      return data || [];
    }),

  // Create new NFT asset with ownership assignment
  createAsset: t.procedure
    .input(z.object({
      name: z.string()
        .min(1, "Name is required")
        .trim()
        .max(100, "Name must be less than 100 characters"),
      description: z.string()
        .min(1, "Description is required")
        .trim()
        .max(500, "Description must be less than 500 characters"),
      ownerId: z.string().uuid()
    }))
    .mutation(async ({ input }): Promise<Asset> => {
      try {
        const sanitizedInput = {
          name: input.name.trim(),
          description: input.description.trim(),
          ownerId: input.ownerId
        };

        const { data: asset, error: assetError } = await supabase
          .from('assets')
          .insert({
            name: sanitizedInput.name,
            description: sanitizedInput.description,
            owner_id: sanitizedInput.ownerId
          })
          .select()
          .single();

        if (assetError) {
          throw new TRPCError({
            code: 'INTERNAL_SERVER_ERROR',
            message: assetError.message,
          });
        }

        return asset;
      } catch (error) {
        if (error instanceof TRPCError) throw error;
        
        throw new TRPCError({
          code: 'BAD_REQUEST',
          message: error instanceof Error ? error.message : 'Failed to create asset',
        });
      }
    }),
}); 