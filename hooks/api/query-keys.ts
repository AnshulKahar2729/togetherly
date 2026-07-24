export const queryKeys = {
  couple: {
    all: ['couple'] as const,
    summary: (userId: string) => ['couple', 'summary', userId] as const,
  },
} as const;
