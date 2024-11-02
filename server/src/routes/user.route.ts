import { t } from '../trpc';
import { z } from 'zod';
import { TRPCError } from '@trpc/server';
import { supabase } from '../services/supabase';

export const userRouter = t.router({
  loginOrRegister: t.procedure
    .input(z.object({
      email: z.string().email()
    }))
    .mutation(async ({ input }) => {
      // Try to find existing user 
      const { data: existingUser, error: findError } = await supabase
        .from('users')
        .select('id, email')
        .ilike('email', input.email)
        .single();

      if (findError && findError.code !== 'PGRST116') {
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: findError.message
        });
      }

      if (existingUser) {
        return existingUser;
      }

      // Create new user if not found
      const { data: newUser, error: createError } = await supabase
        .from('users')
        .insert({ email: input.email.toLowerCase() })
        .select('id, email')
        .single();

      if (createError) {
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: createError.message
        });
      }

      return newUser;
    }),

  getUserByEmail: t.procedure
    .input(z.object({
      email: z.string().email()
    }))
    .query(async ({ input }) => {
      const { data, error } = await supabase
        .from('users')
        .select('id, email')
        .ilike('email', input.email)
        .single();

      if (error) {
        throw new TRPCError({
          code: 'NOT_FOUND',
          message: 'User not found'
        });
      }

      return data;
    })
}); 