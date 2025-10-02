import React from 'react';

export default function CategoryFilter({ value, onChange, categories }) {
  return (
    <select value={value} onChange={e => onChange(e.target.value)}>
      <option value="all">All categories</option>
      {categories.map(c => <option key={c} value={c}>{c}</option>)}
    </select>
  );
}
