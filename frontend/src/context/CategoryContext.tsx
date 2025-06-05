import { createContext, useContext, ReactNode } from 'react';
import { useCategoriesQuery } from '@/features/categories/hooks/useCategoriesQuery';

export type Category = {
  id: string;
  name: string;
};

type CategoryContextType = {
  categories: Category[];
  loading: boolean;
  error?: string;
};

const CategoryContext = createContext<CategoryContextType>({
  categories: [],
  loading: true,
});

export function CategoryProvider({ children }: { children: ReactNode }) {
  const { data, isLoading, error } = useCategoriesQuery();

  return (
    <CategoryContext.Provider
      value={{
        categories: data ?? [],
        loading: isLoading,
        error: error?.message,
      }}
    >
      {children}
    </CategoryContext.Provider>
  );
}

export const useCategories = () => useContext(CategoryContext);
