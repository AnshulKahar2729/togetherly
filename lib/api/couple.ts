import { buildAvatarFromProfile, type LoreleiAvatarConfig } from '@/lib/lorelei-avatar';
import { config } from '@/lib/config';

type CoupleUserSummary = {
  id: string;
  name: string;
  gender: 'woman' | 'man';
  avatarSeed: string;
};

type CoupleSummaryResponse = {
  self: CoupleUserSummary;
  partner: CoupleUserSummary | null;
  hasPartner: boolean;
};

export type CoupleSummary = {
  self: { displayName: string; avatar: LoreleiAvatarConfig };
  partner: { displayName: string; avatar: LoreleiAvatarConfig } | null;
  hasPartner: boolean;
};

function toCoupleSummary(raw: CoupleSummaryResponse): CoupleSummary {
  return {
    self: {
      displayName: raw.self.name,
      avatar: buildAvatarFromProfile({ avatarSeed: raw.self.avatarSeed, gender: raw.self.gender }),
    },
    partner: raw.partner
      ? {
          displayName: raw.partner.name,
          avatar: buildAvatarFromProfile({
            avatarSeed: raw.partner.avatarSeed,
            gender: raw.partner.gender,
          }),
        }
      : null,
    hasPartner: raw.hasPartner,
  };
}

export async function fetchCoupleSummary(userId: string): Promise<CoupleSummary> {
  const res = await fetch(`${config.apiBaseUrl}/couple/summary?userId=${userId}`);
  const body = await res.json().catch(() => ({})) as { data?: CoupleSummaryResponse; error?: { message?: string } };
  if (!res.ok) throw new Error(body.error?.message ?? `Request failed (${res.status})`);
  return toCoupleSummary(body.data!);
}
