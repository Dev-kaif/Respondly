import { useMutation } from '@tanstack/react-query'

import { deleteAccount } from '@/src/lib/api'

export function useDeleteAccount() {
  return useMutation({
    mutationFn: deleteAccount,
  })
}
