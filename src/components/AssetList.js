// src/components/AssetList.js

import React, { useState, useEffect } from 'react';

const AssetList = () => {
  const stockData = [
    { ticker: 'AAPL', price: 150, sector: 'Technology', volume: 1000 },
    { ticker: 'GOOGL', price: 2800, sector: 'Technology', volume: 800 },
    { ticker: 'TSLA', price: 730, sector: 'Automotive', volume: 500 },
    { ticker: 'AMZN', price: 3300, sector: 'E-commerce', volume: 300 },
    { ticker: 'NFLX', price: 590, sector: 'Entertainment', volume: 400 },
  ];

  const [search, setSearch] = useState('');
  const [sortKey, setSortKey] = useState('ticker');
  const [sortOrder, setSortOrder] = useState('asc');
  const [filteredData, setFilteredData] = useState(stockData);

  useEffect(() => {
    let filtered = stockData.filter((item) =>
      item.ticker.toLowerCase().includes(search.toLowerCase()) ||
      item.sector.toLowerCase().includes(search.toLowerCase())
    );

    filtered = filtered.sort((a, b) => {
      const order = sortOrder === 'asc' ? 1 : -1;
      if (a[sortKey] < b[sortKey]) return -1 * order;
      if (a[sortKey] > b[sortKey]) return 1 * order;
      return 0;
    });

    setFilteredData(filtered);
  }, [search, sortKey, sortOrder]);

  const toggleSortOrder = (key) => {
    if (sortKey === key) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortKey(key);
      setSortOrder('asc');
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Stock Market Assets</h1>

      <input
        type="text"
        placeholder="Search by ticker or sector"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="p-2 border border-gray-300 rounded mb-4 w-full"
      />

      <table className="min-w-full bg-white border">
        <thead>
          <tr>
            <th className="py-2 px-4 border cursor-pointer" onClick={() => toggleSortOrder('ticker')}>
              Ticker {sortKey === 'ticker' && (sortOrder === 'asc' ? '▲' : '▼')}
            </th>
            <th className="py-2 px-4 border cursor-pointer" onClick={() => toggleSortOrder('price')}>
              Price {sortKey === 'price' && (sortOrder === 'asc' ? '▲' : '▼')}
            </th>
            <th className="py-2 px-4 border cursor-pointer" onClick={() => toggleSortOrder('sector')}>
              Sector {sortKey === 'sector' && (sortOrder === 'asc' ? '▲' : '▼')}
            </th>
            <th className="py-2 px-4 border cursor-pointer" onClick={() => toggleSortOrder('volume')}>
              Volume {sortKey === 'volume' && (sortOrder === 'asc' ? '▲' : '▼')}
            </th>
          </tr>
        </thead>
        <tbody>
          {filteredData.length > 0 ? (
            filteredData.map((item) => (
              <tr key={item.ticker}>
                <td className="py-2 px-4 border">{item.ticker}</td>
                <td className="py-2 px-4 border">{item.price}</td>
                <td className="py-2 px-4 border">{item.sector}</td>
                <td className="py-2 px-4 border">{item.volume}</td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="4" className="text-center py-4">No matching records found</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default AssetList;
