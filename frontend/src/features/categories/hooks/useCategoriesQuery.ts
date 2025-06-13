import { useQuery } from '@tanstack/react-query';
import { Category } from '@/context/CategoryContext';
import { apiFetch } from '@/utils/api'; // Adjust path if needed

export async function fetchCategories(): Promise<Category[]> {
  return await apiFetch('/api/categories');
}

export function useCategoriesQuery() {
  return useQuery<Category[]>({
    queryKey: ['categories'],
    queryFn: fetchCategories,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
}
