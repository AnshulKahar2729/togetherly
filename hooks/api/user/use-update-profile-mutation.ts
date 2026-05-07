import { useMutation, useQueryClient } from '@tanstack/react-query';

import { createUser, updateUser } from '@/lib/api/users';
import { loadUserProfile, saveUserProfile } from '@/lib/storage/user-profile';
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
      const existing = loadUserProfile();
      const user = existing
        ? await updateUser(existing.id, { name, gender: avatar.gender, avatarSeed: avatar.seed })
        : await createUser({ name, gender: avatar.gender, avatarSeed: avatar.seed });
      saveUserProfile({
        id: user.id,
        name: user.name,
        gender: user.gender,
        avatarSeed: user.avatarSeed,
        spaceId: user.spaceId,
      });
      return user;
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: queryKeys.couple.all });
    },
  });
}
