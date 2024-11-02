import { trpc } from '../../lib/trpc';

export function useAuth() {
  const utils = trpc.useUtils();
  const registerMutation = trpc.user.loginOrRegister.useMutation({
    onSuccess: () => {
      utils.user.getUserByEmail.invalidate();
    },
  });

  const loginMutation = trpc.user.loginOrRegister.useMutation({
    onSuccess: () => {
      utils.user.getUserByEmail.invalidate();
    },
  });

  return {
    register: (email: string) => registerMutation.mutateAsync({ email }),
    login: (email: string) => loginMutation.mutateAsync({ email }),
    isLoading: registerMutation.isLoading || loginMutation.isLoading,
    error: registerMutation.error || loginMutation.error,
  };
} 