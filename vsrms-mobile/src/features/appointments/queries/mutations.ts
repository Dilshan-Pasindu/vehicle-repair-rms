import { useMutation, useQueryClient } from '@tanstack/react-query';
import { appointmentKeys } from './appointments.keys';
import { createAppointment, updateAppointmentStatus, deleteAppointment } from '../api/appointments.api';
import { useToast } from '@/providers/ToastProvider';
import { handleApiError } from '@/services/error.handler';

export function useCreateAppointment() {
  const qc = useQueryClient();
  const { showToast } = useToast();

  return useMutation({
    mutationFn: createAppointment,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: appointmentKeys.mine() });
      showToast('Appointment booked successfully!', 'success');
    },
    onError: (e: any) => showToast(handleApiError(e), 'error'),
  });
}

export function useUpdateAppointmentStatus() {
  const qc = useQueryClient();
  const { showToast } = useToast();

  return useMutation({
    mutationFn: ({ id, status }: { id: string; status: string }) => updateAppointmentStatus(id, status),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: appointmentKeys.all() });
      showToast('Status updated', 'success');
    },
    onError: (e: any) => showToast(handleApiError(e), 'error'),
  });
}

export function useDeleteAppointment() {
  const qc = useQueryClient();
  const { showToast } = useToast();

  return useMutation({
    mutationFn: deleteAppointment,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: appointmentKeys.mine() });
      showToast('Appointment cancelled', 'success');
    },
    onError: (e: any) => showToast(handleApiError(e), 'error'),
  });
}
