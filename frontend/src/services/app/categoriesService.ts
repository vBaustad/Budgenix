export type Category = {
  id: string;
  name: string;
};


export async function fetchUsedCategories(): Promise<Category[]> {
  const res = await fetch('/api/categories', {
    credentials: 'include',
  });

  if (!res.ok) throw new Error('Failed to fetch categories');
  return res.json();
}