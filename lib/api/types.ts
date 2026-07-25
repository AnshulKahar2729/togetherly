export type UserResponse = {
  id: string;
  email: string | null;
  name: string;
  gender: 'woman' | 'man';
  avatarSeed: string;
  spaceId: string | null;
};
