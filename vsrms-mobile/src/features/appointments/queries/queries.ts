import { useQuery } from '@tanstack/react-query';
import { appointmentKeys } from './appointments.keys';
import { fetchMyAppointments, fetchAppointment, fetchWorkshopAppointments } from '../api/appointments.api';

export function useMyAppointments(status?: string) {
  return useQuery({
    queryKey: [...appointmentKeys.mine(), status],
    queryFn: () => fetchMyAppointments(status ? { status } : undefined),
    staleTime: 0,
  });
}

export function useWorkshopAppointments(workshopId: string | undefined, status?: string) {
  return useQuery({
    queryKey: [...appointmentKeys.workshop(workshopId ?? ''), status],
    queryFn: () => fetchWorkshopAppointments(workshopId!, status ? { status } : undefined),
    enabled: !!workshopId,
    staleTime: 0,
  });
}

export function useAppointment(id: string) {
  return useQuery({
    queryKey: appointmentKeys.detail(id),
    queryFn: () => fetchAppointment(id),
    staleTime: 0,
  });
}
