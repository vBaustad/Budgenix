// import { useEffect } from "react";
import { useTranslation } from "react-i18next";

export default function BudgetsPage() {
  const { t } = useTranslation();

  // useEffect(() => {
  //     document.title = "Manually set title";
  // }, []);

  return (
    <>
      <div className="flex min-h-screen bg-base-100 text-base-content">        
        <div className="p-4">
          <h2 className="text-sm text-base-content/70 mb-4">{t('dashboard.welcome')}</h2>
          <p>{t('dashboard.description')}</p>
        </div>
      </div>
    </>
  );
}
