import React from 'react';
import { DateTime } from 'luxon';

function formatOffset(offsetMinutes) {
  const sign = offsetMinutes >= 0 ? '+' : '-';
  const abs = Math.abs(offsetMinutes);
  const hours = Math.floor(abs / 60);
  const mins = abs % 60;
  return `UTC${sign}${String(hours).padStart(2, '0')}:${String(mins).padStart(2, '0')}`;
}

export default function TimezoneCard({ timezone, countries, now }) {
  // now is a Luxon DateTime in system zone; setZone produces a DateTime in target zone
  const dt = now.setZone(timezone);
  const timeStr = dt.toFormat('HH:mm:ss');
  const dateStr = dt.toLocaleString(DateTime.DATE_MED);
  const offset = formatOffset(dt.offset);
  const inDST = dt.isInDST ? 'DST' : 'STD';

  const previewCountries = countries.slice(0, 3);
  const more = countries.length - previewCountries.length;

  return (
    <article className="card" aria-label={`Timezone ${timezone}`}>
      <div className="card-header">
        <div className="tz-name">{timezone}</div>
        <div className="tz-meta">{offset} • {inDST}</div>
      </div>

      <div className="time">{timeStr}</div>
      <div className="date">{dateStr}</div>

      <div className="countries">
        {previewCountries.map((c) => (
          <div className="country" key={c.cca2}>
            {c.flag && <img src={c.flag} alt={`${c.name} flag`} width="20" height="14" loading="lazy" />}
            <span className="country-name">{c.name}</span>
            {c.capital ? <span className="capital"> — {c.capital}</span> : null}
          </div>
        ))}
        {more > 0 ? <div className="more">+{more} more</div> : null}
      </div>

      <div className="card-footer">
        <small>Local offset: {offset} • {inDST}</small>
      </div>
    </article>
  );
}
