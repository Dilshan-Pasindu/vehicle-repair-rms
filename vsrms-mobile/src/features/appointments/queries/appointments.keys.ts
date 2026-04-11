export const appointmentKeys = {
  all:      () => ['appointments'] as const,
  mine:     () => [...appointmentKeys.all(), 'mine'] as const,
  workshop: (workshopId: string) => [...appointmentKeys.all(), 'workshop', workshopId] as const,
  detail:   (id: string) => [...appointmentKeys.all(), id] as const,
};
