import { useMutation, useQueryClient } from '@tanstack/react-query';

import { joinSpace } from '@/lib/api/spaces';
import { saveLocalCoupleSpace } from '@/lib/storage/couple-space';
import { loadUserProfile, saveUserProfile } from '@/lib/storage/user-profile';
import { queryKeys } from '../query-keys';

export function useJoinSpaceMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (inviteCode: string) => {
      const profile = loadUserProfile();
      if (!profile) throw new Error('Profile not found');
      const space = await joinSpace(inviteCode);
      saveLocalCoupleSpace({ inviteCode: space.inviteCode, role: 'member' });
      saveUserProfile({ ...profile, spaceId: space.id });
      return space;
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: queryKeys.couple.all });
    },
  });
}
