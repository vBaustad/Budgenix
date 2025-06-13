import { useState } from 'react';
import {  
  BarChartIcon,
  PieChartIcon,
  PlusIcon,
  SettingsIcon,
} from 'lucide-react';

type CityName = 'Bangkok' | 'Chiang Mai' | 'Krabi' | 'Koh Lanta' | 'Phuket';

export default function VacationModePage() {
  const [vacationActive, setVacationActive] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [showStartModal, setShowStartModal] = useState(false);
  const [activeCity, setActiveCity] = useState<CityName>('Bangkok');

  const cities: CityName[] = ['Bangkok', 'Chiang Mai', 'Krabi', 'Koh Lanta', 'Phuket'];

  const masterSummary = {
    total: 61334.86,
    days: 21,
    daily: 2920.71,
    budget: 40000,
  };

  const citySummary: Record<CityName, { days: number; total: number; daily: number }> = {
    Bangkok: { days: 2, total: 2941, daily: 1470 },
    'Chiang Mai': { days: 6, total: 6416, daily: 1070 },
    Krabi: { days: 4, total: 9150, daily: 2287 },
    'Koh Lanta': { days: 5, total: 14406, daily: 2881 },
    Phuket: { days: 4, total: 5540, daily: 1385 },
  };

  return (
    <div className="min-h-screen max-w-7xl mx-auto p-6 space-y-10 relative">
      <div className="text-center">
        <h1 className="text-5xl font-bold">🌴 Vacation Mode</h1>
        <p className="text-sm text-base-content/70">All data is demo / mock for concept preview.</p>
      </div>

      {!vacationActive && (
        <div className="flex flex-col items-center justify-center space-y-4 mt-10">
          <button
            className="btn btn-primary btn-lg"
            onClick={() => setShowStartModal(true)}
          >
            <PlusIcon className="w-5 h-5" /> Start Vacation Planner
          </button>
          <p className="text-sm text-base-content/70 max-w-md text-center">
            Plan your trip from start to finish — set your budget, destination, and timeline, or start with a savings goal.
          </p>
        </div>
      )}

      {vacationActive && (
        <>
          <div className="flex justify-end">
            <button
              className="btn btn-sm btn-ghost gap-1"
              onClick={() => setShowSettings(true)}
            >
              <SettingsIcon className="w-4 h-4" /> Vacation Settings
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="border rounded-xl p-4 text-center">
              <div className="text-xl font-semibold">Total Cost</div>
              <div className="text-3xl font-bold text-blue-500">{masterSummary.total.toLocaleString()} kr</div>
              <div className="text-xs text-base-content/70">Budget: {masterSummary.budget.toLocaleString()} kr</div>
            </div>
            <div className="border rounded-xl p-4 text-center">
              <div className="text-xl font-semibold">Days Away</div>
              <div className="text-3xl font-bold text-green-500">{masterSummary.days}</div>
            </div>
            <div className="border rounded-xl p-4 text-center">
              <div className="text-xl font-semibold">Cost Per Day</div>
              <div className="text-3xl font-bold text-purple-500">{masterSummary.daily.toLocaleString()} kr</div>
            </div>
          </div>

          <div className="flex flex-wrap gap-2">
            {cities.map((city) => (
              <button
                key={city}
                onClick={() => setActiveCity(city)}
                className={`btn btn-sm ${activeCity === city ? 'btn-primary' : 'btn-ghost'}`}
              >
                {city}
              </button>
            ))}
            <button className="btn btn-sm btn-info gap-1">
              <PlusIcon className="w-3 h-3" /> Add City
            </button>
          </div>

          <div className="border rounded-xl p-4 mt-2 space-y-2">
            <h2 className="font-semibold text-lg">{activeCity} Summary</h2>
            <div className="flex flex-wrap gap-4">
              <div className="flex-1">
                <div className="text-sm text-base-content/70">Days</div>
                <div className="text-xl font-bold">{citySummary[activeCity].days}</div>
              </div>
              <div className="flex-1">
                <div className="text-sm text-base-content/70">Total</div>
                <div className="text-xl font-bold">{citySummary[activeCity].total.toLocaleString()} kr</div>
              </div>
              <div className="flex-1">
                <div className="text-sm text-base-content/70">Per Day</div>
                <div className="text-xl font-bold">{citySummary[activeCity].daily.toLocaleString()} kr</div>
              </div>
            </div>
          </div>

          <div className="border rounded-xl p-4 overflow-x-auto">
            <h3 className="font-semibold mb-2">Expenses Per Location</h3>
            <table className="table text-xs">
              <thead>
                <tr>
                  <th>Location</th>
                  <th>Accommodation</th>
                  <th>Food</th>
                  <th>Transport</th>
                  <th>Activities</th>
                  <th>Others</th>
                  <th>Total</th>
                  <th>Days</th>
                  <th>Cost/Day</th>
                </tr>
              </thead>
              <tbody>
                {cities.map((city) => (
                  <tr key={city}>
                    <td>{city}</td>
                    <td>...</td>
                    <td>...</td>
                    <td>...</td>
                    <td>...</td>
                    <td>...</td>
                    <td>{citySummary[city].total.toLocaleString()} kr</td>
                    <td>{citySummary[city].days}</td>
                    <td>{citySummary[city].daily.toLocaleString()} kr</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="border rounded-xl p-4">
              <div className="flex gap-1 items-center mb-1 text-base-content/70">
                <PieChartIcon className="w-4 h-4" /> Cost Distribution
              </div>
              <div className="w-full h-48 bg-base-300 rounded animate-pulse"></div>
            </div>
            <div className="border rounded-xl p-4">
              <div className="flex gap-1 items-center mb-1 text-base-content/70">
                <BarChartIcon className="w-4 h-4" /> Daily Spend Trend
              </div>
              <div className="w-full h-48 bg-base-300 rounded animate-pulse"></div>
            </div>
          </div>
        </>
      )}

      {showSettings && (
        <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50">
          <div className="bg-base-100 rounded-xl p-6 max-w-sm space-y-4">
            <h3 className="font-semibold text-lg">Vacation Settings</h3>
            <div className="space-y-2 text-sm">
              <div>Budget: <span className="font-medium">{masterSummary.budget.toLocaleString()} kr</span></div>
              <div>Days planned: <span className="font-medium">{masterSummary.days}</span></div>
              <div>Destination: <span className="font-medium">Thailand</span></div>
            </div>
            <div className="flex gap-2 justify-end">
              <button className="btn btn-sm btn-ghost" onClick={() => setShowSettings(false)}>Close</button>
              <button className="btn btn-sm btn-warning">End Vacation</button>
            </div>
          </div>
        </div>
      )}

      {showStartModal && (
        <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50">
          <div className="bg-base-100 rounded-xl p-6 max-w-sm space-y-4">
            <h3 className="font-semibold text-lg">Start Vacation Planner</h3>
            <div className="space-y-2">
              <input className="input input-sm w-full" placeholder="Destination" />
              <input className="input input-sm w-full" placeholder="Budget (kr)" />
              <input className="input input-sm w-full" placeholder="Days" />
              <label className="flex items-center gap-2 text-sm">
                <input type="checkbox" className="checkbox checkbox-sm" /> Create savings goal first?
              </label>
            </div>
            <div className="flex gap-2 justify-end">
              <button className="btn btn-sm btn-ghost" onClick={() => setShowStartModal(false)}>Cancel</button>
              <button
                className="btn btn-sm btn-primary"
                onClick={() => {
                  setShowStartModal(false);
                  setVacationActive(true);
                }}
              >
                Start
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
