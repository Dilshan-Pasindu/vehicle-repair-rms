import { useMutation, useQueryClient } from '@tanstack/react-query';
import { authKeys } from './auth.keys';
import { updateMe, deactivateUser } from '../api/auth.api';
import { useToast } from '@/providers/ToastProvider';
import { handleApiError } from '@/services/error.handler';

export function useUpdateMe() {
  const qc = useQueryClient();
  const { showToast } = useToast();

  return useMutation({
    mutationFn: updateMe,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: authKeys.me() });
      showToast('Profile updated', 'success');
    },
    onError: (e: any) => showToast(handleApiError(e), 'error'),
  });
}

export function useDeactivateUser() {
  const qc = useQueryClient();
  const { showToast } = useToast();

  return useMutation({
    mutationFn: deactivateUser,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: authKeys.users() });
      showToast('User deactivated', 'success');
    },
    onError: (e: any) => showToast(handleApiError(e), 'error'),
  });
}
