import { CurrencyProvider } from './CurrencyContext';
import { CategoryProvider } from './CategoryContext';
import { DateFilterProvider } from './DateFilterContext';

export const CoreProvider = ({ children }: { children: React.ReactNode }) => (
  <CurrencyProvider>
    <CategoryProvider>
      <DateFilterProvider>
        {children}
      </DateFilterProvider>
    </CategoryProvider>
  </CurrencyProvider>
);
