import { t } from '../trpc';
import { assetRouter } from './asset.route';
import { transactionRouter } from './transaction.route';
import { userRouter } from './user.route';

export const appRouter = t.router({
  asset: assetRouter,
  transaction: transactionRouter,
  user: userRouter,
});

export type AppRouter = typeof appRouter; 