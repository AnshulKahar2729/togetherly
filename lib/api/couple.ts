import { buildAvatarFromProfile, type LoreleiAvatarConfig } from '@/lib/lorelei-avatar';

import { apiFetch, parseJsonResponse } from '@/lib/api/http';

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

export async function fetchCoupleSummary(): Promise<CoupleSummary> {
  const res = await apiFetch('/couple/summary');
  const raw = await parseJsonResponse<CoupleSummaryResponse>(res);
  return toCoupleSummary(raw);
}
