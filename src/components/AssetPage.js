import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSort } from '@fortawesome/free-solid-svg-icons';
import assetData from '../assets/Data.json'; // Path to your data.json file
import holdingData from '../assets/holding_data.json'; // Path to your holding_data.json file

const AssetPage = () => {
  const [assets, setAssets] = useState([]);
  const [holdings, setHoldings] = useState([]); // State for holdings
  const [selectedAsset, setSelectedAsset] = useState(null);
  const [sortOrder, setSortOrder] = useState({ name: 'asc', ltp: 'asc' });
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [filters, setFilters] = useState({
    sectors: [],
    minPL: -Infinity,
    maxPL: Infinity,
  });
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('all'); // State for active tab

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setTimeout(() => {
        setAssets(assetData);
        setHoldings(holdingData); // Load holdings data
        setLoading(false);
      }, 500);
    };
    fetchData();
  }, []);

  const handleAssetClick = (asset) => {
    setSelectedAsset(asset);
  };

  const sortAssets = (type) => {
    const sortedAssets = [...assets].sort((a, b) => {
      if (type === 'name') {
        return sortOrder.name === 'asc'
          ? a.name.localeCompare(b.name)
          : b.name.localeCompare(a.name);
      } else if (type === 'ltp') {
        return sortOrder.ltp === 'asc' ? a.ltp - b.ltp : b.ltp - a.ltp;
      }
      return 0;
    });

    setAssets(sortedAssets);
    setSortOrder((prev) => ({
      ...prev,
      [type]: prev[type] === 'asc' ? 'desc' : 'asc',
    }));
    setDropdownOpen(false);
  };

  const applyFilters = () => {
    return assets.filter(asset => {
      const meetsSector = filters.sectors.length > 0 ? filters.sectors.includes(asset.sector) : true;
      const meetsPL = asset.overallPercent >= filters.minPL && asset.overallPercent <= filters.maxPL;
      return meetsSector && meetsPL;
    });
  };

  const handleFilterChange = (e) => {
    const { value, checked } = e.target;
    setFilters((prev) => {
      const newSectors = checked
        ? [...prev.sectors, value]
        : prev.sectors.filter(sector => sector !== value);
      return { ...prev, sectors: newSectors };
    });
  };

  const clearFilters = () => {
    setFilters({ sectors: [], minPL: -Infinity, maxPL: Infinity });
  };

  const openModal = () => setModalOpen(true);
  const closeModal = () => setModalOpen(false);

  const filteredAssets = applyFilters();
  const uniqueSectors = [...new Set(assets.map(asset => asset.sector))];

  // Function to get current holdings
  const getCurrentHoldings = () => {
    return holdings; // Simply return the holdings data
  };

  // Function to handle buying an asset
  const handleBuy = (asset) => {
    setHoldings((prevHoldings) => {
      // Check if the asset already exists in holdings
      const existingHolding = prevHoldings.find(item => item.id === asset.id);
      if (existingHolding) {
        // If exists, you can update it or just return the previous state
        return prevHoldings;
      }
      return [...prevHoldings, asset]; // Append new asset to holdings
    });
  };

  return (
    <div className="min-h-screen flex bg-gray-100">
      <div className="w-1/4 bg-white p-4 shadow-lg relative">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-bold">Today's Assets</h3>
          <div className="relative">
            <div 
              onClick={() => setDropdownOpen((prev) => !prev)} 
              className="cursor-pointer"
            >
              <FontAwesomeIcon icon={faSort} className="text-gray-600" />
            </div>
            {dropdownOpen && (
              <div className="absolute right-0 bg-white shadow-lg rounded mt-2">
                <div 
                  className="px-4 py-2 hover:bg-gray-200 cursor-pointer"
                  onClick={() => sortAssets('name')}
                >
                  Sort by Name
                </div>
                <div 
                  className="px-4 py-2 hover:bg-gray-200 cursor-pointer"
                  onClick={() => sortAssets('ltp')}
                >
                  Sort by LTP
                </div>
              </div>
            )}
          </div>
        </div>

        <ul>
          {assets.map((asset) => (
            <li
              key={asset.id}
              onClick={() => handleAssetClick(asset)}
              className="cursor-pointer mb-4 flex justify-between items-center hover:bg-gray-200 p-2 rounded transition"
            >
              <div>
                <p className="font-bold">{asset.name}</p>
                <p className="text-sm text-gray-500">{asset.symbol}</p>
              </div>
              <div className="text-right">
                <p className="font-bold">{asset.ltp}</p>
                <p className={`text-sm ${asset.overallPercent < 0 ? 'text-red-500' : 'text-green-500'}`}>
                  {asset.overallPercent.toFixed(2)}%
                </p>
                <div className="flex space-x-2">
                  <button
                    onClick={(e) => {
                      e.stopPropagation(); // Prevent triggering onClick for the li
                      handleBuy(asset);
                    }}
                    className="bg-green-500 text-white px-2 py-1 rounded hover:bg-green-600"
                  >
                    B
                  </button>
                  <button className="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600">
                    S
                  </button>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>

      <div className="w-3/4 p-8">
        {loading ? (
          <div className="flex items-center justify-center h-full">
            <p className="text-lg">Loading assets...</p>
          </div>
        ) : (
          <>
            {/* Tab Navigation */}
            <div className="mb-4">
              <button
                onClick={() => setActiveTab('all')}
                className={`px-4 py-2 ${activeTab === 'all' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
              >
                All Sectors
              </button>
              <button
                onClick={() => setActiveTab('holdings')}
                className={`px-4 py-2 ${activeTab === 'holdings' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
              >
                Current Holdings
              </button>
            </div>

            {/* Filters Section */}
            <div className="mb-8">
              <h4 className="font-bold text-xl mb-4">Filters</h4>
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Sectors</label>
                  <button 
                    onClick={openModal} 
                    className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                  >
                    Choose Sectors
                  </button>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Min P/L (%)</label>
                  <input
                    type="number"
                    name="minPL"
                    placeholder="Min P/L (%)"
                    onChange={(e) => setFilters((prev) => ({ ...prev, minPL: Number(e.target.value) }))}
                    className="w-full p-2 border rounded"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Max P/L (%)</label>
                  <input
                    type="number"
                    name="maxPL"
                    placeholder="Max P/L (%)"
                    onChange={(e) => setFilters((prev) => ({ ...prev, maxPL: Number(e.target.value) }))}
                    className="w-full p-2 border rounded"
                  />
                </div>
              </div>
            </div>

            {/* Display Content Based on Active Tab */}
            {activeTab === 'all' ? (
              <div className="bg-white p-8 shadow-lg rounded-lg">
                <h2 className="text-2xl font-bold mb-4">Filtered Assets</h2>
                <table className="min-w-full border-collapse border border-gray-300">
                  <thead>
                    <tr>
                      <th className="border border-gray-300 px-4 py-2">Name</th>
                      <th className="border border-gray-300 px-4 py-2">Symbol</th>
                      <th className="border border-gray-300 px-4 py-2">LTP</th>
                      <th className="border border-gray-300 px-4 py-2">P/L (%)</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredAssets.length > 0 ? (
                      filteredAssets.map((asset) => (
                        <tr key={asset.id} className="hover:bg-gray-200 cursor-pointer" onClick={() => handleAssetClick(asset)}>
                          <td className="border border-gray-300 px-4 py-2">{asset.name}</td>
                          <td className="border border-gray-300 px-4 py-2">{asset.symbol}</td>
                          <td className="border border-gray-300 px-4 py-2">{asset.ltp}</td>
                          <td className={`border border-gray-300 px-4 py-2 ${asset.overallPercent < 0 ? 'text-red-500' : 'text-green-500'}`}>
                            {asset.overallPercent.toFixed(2)}%
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="4" className="text-center border border-gray-300 px-4 py-2">No assets found</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="bg-white p-8 shadow-lg rounded-lg">
                <h2 className="text-2xl font-bold mb-4">Current Holdings</h2>
                <table className="min-w-full border-collapse border border-gray-300">
                  <thead>
                    <tr>
                      <th className="border border-gray-300 px-4 py-2">Name</th>
                      <th className="border border-gray-300 px-4 py-2">Symbol</th>
                      <th className="border border-gray-300 px-4 py-2">LTP</th>
                      <th className="border border-gray-300 px-4 py-2">P/L (%)</th>
                    </tr>
                  </thead>
                  <tbody>
                    {getCurrentHoldings().length > 0 ? (
                      getCurrentHoldings().map((asset) => (
                        <tr key={asset.id} className="hover:bg-gray-200 cursor-pointer" onClick={() => handleAssetClick(asset)}>
                          <td className="border border-gray-300 px-4 py-2">{asset.name}</td>
                          <td className="border border-gray-300 px-4 py-2">{asset.symbol}</td>
                          <td className="border border-gray-300 px-4 py-2">{asset.ltp}</td>
                          <td className={`border border-gray-300 px-4 py-2 ${asset.overallPercent < 0 ? 'text-red-500' : 'text-green-500'}`}>
                            {asset.overallPercent.toFixed(2)}%
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="4" className="text-center border border-gray-300 px-4 py-2">No current holdings found</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default AssetPage;
