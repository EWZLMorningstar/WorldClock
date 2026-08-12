import React, { useEffect, useState, useMemo } from 'react';
import { DateTime } from 'luxon';
import TimezoneCard from './components/TimezoneCard';

export default function App() {
  const [tzMap, setTzMap] = useState([]); // [{ timezone, countries: [{name, flag, cca2, capital}, ...] }]
  const [query, setQuery] = useState('');
  const [sortByTime, setSortByTime] = useState(false);
  const [nowTick, setNowTick] = useState(DateTime.now());

  useEffect(() => {
    // fetch countries data and group by timezone
    fetch('https://restcountries.com/v3.1/all')
      .then((r) => r.json())
      .then((data) => {
        const map = new Map();
        data.forEach((c) => {
          const name = c.name?.common ?? 'Unknown';
          const flag = c.flags?.png || c.flags?.svg || null;
          const cca2 = c.cca2 || name;
          const capital = Array.isArray(c.capital) ? c.capital[0] : c.capital || '';
          const timezones = Array.isArray(c.timezones) ? c.timezones : [];
          timezones.forEach((tz) => {
            if (!map.has(tz)) map.set(tz, { timezone: tz, countries: [] });
            map.get(tz).countries.push({ name, flag, cca2, capital });
          });
        });
        const arr = Array.from(map.values()).sort((a, b) =>
          a.timezone.localeCompare(b.timezone)
        );
        setTzMap(arr);
      })
      .catch((err) => {
        console.error('Failed to fetch countries:', err);
      });
  }, []);

  // Global single timer for all clocks
  useEffect(() => {
    const id = setInterval(() => setNowTick(DateTime.now()), 1000);
    return () => clearInterval(id);
  }, []);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    let list = tzMap;
    if (q) {
      list = tzMap.filter((t) => {
        if (t.timezone.toLowerCase().includes(q)) return true;
        return t.countries.some((c) => c.name.toLowerCase().includes(q));
      });
    }
    if (sortByTime) {
      list = [...list].sort((a, b) => {
        const ta = nowTick.setZone(a.timezone).toMillis();
        const tb = nowTick.setZone(b.timezone).toMillis();
        return ta - tb;
      });
    }
    return list;
  }, [tzMap, query, sortByTime, nowTick]);

  return (
    <div className="app">
      <header className="header">
        <h1>World Timezones</h1>
        <div className="controls">
          <input
            className="search"
            placeholder="Search timezones or countries..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            aria-label="Search timezones or countries"
          />
          <label className="toggle">
            <input
              type="checkbox"
              checked={sortByTime}
              onChange={(e) => setSortByTime(e.target.checked)}
            />
            Sort by local time
          </label>
        </div>
      </header>

      <main>
        <p className="summary">
          Showing {filtered.length} timezones • Data: REST Countries (IANA timezone IDs)
        </p>

        <div className="grid">
          {filtered.map((t) => (
            <TimezoneCard key={t.timezone} timezone={t.timezone} countries={t.countries} now={nowTick} />
          ))}
        </div>
      </main>

      <footer className="footer">
        <small>
          Built with React + Vite • Timezone data from restcountries.com • Times computed locally using Luxon/Intl
        </small>
      </footer>
    </div>
  );
}
