import { useQuery } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { useAuth } from '@/lib/AuthContext';

export function useSubscription() {
  const { user, isAuthenticated } = useAuth();
  return useQuery({
    queryKey: ['my-subscription', user?.email],
    queryFn: async () => {
      try {
        const list = await base44.entities.Subscription.filter(
          { user_email: user.email }, '-created_date', 1
        );
        return list[0] || null;
      } catch {
        return null;
      }
    },
    enabled: isAuthenticated && !!user?.email,
    staleTime: 30000,
  });
}

export function useMyTransactions() {
  const { user, isAuthenticated } = useAuth();
  return useQuery({
    queryKey: ['my-transactions', user?.email],
    queryFn: async () => {
      try {
        return await base44.entities.Transaction.filter(
          { user_email: user.email }, '-created_date', 50
        );
      } catch {
        return [];
      }
    },
    enabled: isAuthenticated && !!user?.email,
  });
}

export function useReferralCode() {
  const { user, isAuthenticated } = useAuth();
  return useQuery({
    queryKey: ['my-referral', user?.email],
    queryFn: async () => {
      try {
        const list = await base44.entities.ReferralCode.filter(
          { user_email: user.email }, '-created_date', 1
        );
        if (list[0]) return list[0];
        const code = 'ref_' + (user.id || Date.now().toString(36)).slice(-7);
        return await base44.entities.ReferralCode.create({
          user_email: user.email,
          user_id: user.id,
          code,
          referral_count: 0,
          total_earned_rub: 0,
          pending_balance_rub: 0,
        });
      } catch {
        const code = 'ref_' + (user.id || Date.now().toString(36)).slice(-7);
        return { user_email: user.email, code, referral_count: 0, total_earned_rub: 0, pending_balance_rub: 0 };
      }
    },
    enabled: isAuthenticated && !!user?.email,
  });
}