import { createContext, useContext, useEffect, useRef, useState } from 'react';

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

export function CategoryProvider({ children }: { children: React.ReactNode }) {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | undefined>();
  const hasFetched = useRef(false);

  useEffect(() => {
    if (hasFetched.current) return;
    hasFetched.current = true;

    const fetchCategories = async () => {
      try {
        const res = await fetch('/api/categories', {
          credentials: 'include',
        });
        if (!res.ok) throw new Error('Failed to fetch categories');
        const data: Category[] = await res.json();
        setCategories(data);
      } catch (err) {
        console.error('Error loading categories:', err);
        setError('Failed to load categories');
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  return (
    <CategoryContext.Provider value={{ categories, loading, error }}>
      {children}
    </CategoryContext.Provider>
  );
}

export const useCategories = () => useContext(CategoryContext);
