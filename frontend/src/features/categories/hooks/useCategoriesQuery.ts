import { useQuery } from '@tanstack/react-query';
import { Category } from '@/context/CategoryContext';
import { apiFetch } from '@/utils/api';
import { useAuth } from '@/context/AuthContext';

export async function fetchCategories(): Promise<Category[]> {
  return await apiFetch('/api/categories');
}

export function useCategoriesQuery() {
  const { isLoggedIn, authChecked } = useAuth();

  return useQuery<Category[]>({
    queryKey: ['categories'],
    queryFn: fetchCategories,
    enabled: authChecked && isLoggedIn,
    staleTime: 1000 * 60 * 5,
  });
}
