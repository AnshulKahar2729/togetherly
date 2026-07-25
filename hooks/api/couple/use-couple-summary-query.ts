import { useQuery } from '@tanstack/react-query';

import { fetchCoupleSummary } from '@/lib/api/couple';
import { loadUserProfile } from '@/lib/storage/user-profile';
import { queryKeys } from '../query-keys';

export function useCoupleSummaryQuery() {
  const userId = loadUserProfile()?.id ?? null;

  return useQuery({
    queryKey: queryKeys.couple.summary(userId ?? ''),
    queryFn: () => fetchCoupleSummary(),
    enabled: userId !== null,
  });
}
