export const authKeys = {
  all:   () => ['auth'] as const,
  me:    () => [...authKeys.all(), 'me'] as const,
  users: () => [...authKeys.all(), 'users'] as const,
};
