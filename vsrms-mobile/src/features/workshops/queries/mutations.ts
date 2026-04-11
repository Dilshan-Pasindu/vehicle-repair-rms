import { useMutation, useQueryClient } from '@tanstack/react-query';
import { workshopKeys } from './workshops.keys';
import { createWorkshop, deleteWorkshop } from '../api/workshops.api';
import { useToast } from '@/providers/ToastProvider';
import { handleApiError } from '@/services/error.handler';
import { CreateWorkshopPayload } from '../types/workshops.types';

export function useCreateWorkshop() {
  const qc = useQueryClient();
  const { showToast } = useToast();

  return useMutation({
    mutationFn: (payload: CreateWorkshopPayload) => createWorkshop(payload),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: workshopKeys.lists() });
      showToast('Workshop created', 'success');
    },
    onError: (e: any) => showToast(handleApiError(e), 'error'),
  });
}

export function useDeleteWorkshop() {
  const qc = useQueryClient();
  const { showToast } = useToast();

  return useMutation({
    mutationFn: (id: string) => deleteWorkshop(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: workshopKeys.lists() });
      showToast('Workshop deleted', 'success');
    },
    onError: (e: any) => showToast(handleApiError(e), 'error'),
  });
}
