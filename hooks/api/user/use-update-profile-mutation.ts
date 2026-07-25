import { useMutation, useQueryClient } from '@tanstack/react-query';

import { updateProfileMe } from '@/lib/api/users';
import { saveUserProfile, userProfileFromResponse } from '@/lib/storage/user-profile';
import type { LoreleiAvatarConfig } from '@/lib/lorelei-avatar';
import { queryKeys } from '../query-keys';

type UpdateProfileInput = {
  name: string;
  avatar: LoreleiAvatarConfig;
};

export function useUpdateProfileMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ name, avatar }: UpdateProfileInput) => {
      const user = await updateProfileMe({
        name,
        gender: avatar.gender,
        avatarSeed: avatar.seed,
      });
      saveUserProfile(userProfileFromResponse(user));
      return user;
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: queryKeys.couple.all });
    },
  });
}
