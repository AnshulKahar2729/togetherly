import { useMutation, useQueryClient } from '@tanstack/react-query';

import { createSpace } from '@/lib/api/spaces';
import { saveLocalCoupleSpace } from '@/lib/storage/couple-space';
import { loadUserProfile, saveUserProfile } from '@/lib/storage/user-profile';
import { queryKeys } from '../query-keys';

export function useCreateSpaceMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      const profile = loadUserProfile();
      if (!profile) throw new Error('Profile not found');
      const space = await createSpace(profile.id);
      saveLocalCoupleSpace({ inviteCode: space.inviteCode, role: 'owner' });
      saveUserProfile({ ...profile, spaceId: space.id });
      return space;
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: queryKeys.couple.all });
    },
  });
}
