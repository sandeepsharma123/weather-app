import React, { useEffect, useState } from 'react';
import './TempStyle.css';

const Tempapp = () => {
  const [city, setCity] = useState(null);
  const [search, setSearch] = useState('Mumbai');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [unit, setUnit] = useState('metric'); // 'metric' for Celsius, 'imperial' for Fahrenheit
  const [recentSearches, setRecentSearches] = useState([]);

  useEffect(() => {
    const fetchApi = async () => {
      setLoading(true);
      try {
        const url = `http://api.openweathermap.org/data/2.5/weather?q=${search}&units=${unit}&appid=b5bcafd431635a277fca8654cd4effc0`;
        const response = await fetch(url);

        if (!response.ok) {
          throw new Error('City not found');
        }

        const resJson = await response.json();
        setCity(resJson.main);
        setError(null);

        // Update recent searches
        setRecentSearches((prevSearches) => {
          const updatedSearches = [search, ...prevSearches.slice(0, 4)];
          return Array.from(new Set(updatedSearches)); // Remove duplicates
        });
      } catch (error) {
        setCity(null);
        setError('City not found');
      } finally {
        setLoading(false);
      }
    };

    fetchApi();
  }, [search, unit]);

  const handleUnitChange = (newUnit) => {
    setUnit(newUnit);
  };

  return (
    <>
    <div className='tempAppBox'>
      <div className="header">
        <h1>Weather App</h1>
        <div className="unit-switch">
          <button onClick={() => handleUnitChange('metric')} className={unit === 'metric' ? 'active' : ''}>
            Celsius
          </button>
          <button onClick={() => handleUnitChange('imperial')} className={unit === 'imperial' ? 'active' : ''}>
            Fahrenheit
          </button>
        </div>
      </div>
      <div className="box">
        <div className="inputData">
          <input
            type="search"
            value={search}
            className="inputFeild"
            onChange={(event) => {
              setSearch(event.target.value);
            }}
          />
        </div>
        {loading && <p>Loading...</p>}
        {error && <p className="errorMsg">{error}</p>}
        {!loading && !city && !error && <p className="errorMsg">Enter a city name</p>}
        {city && (
          <div>
            <div className="info">
              <h2 className="location">
                <i className="fas fa-street-view"></i>
                {search}
              </h2>
              <h1 className="temp">{city.temp}°{unit === 'metric' ? 'C' : 'F'}</h1>
              <h3 className="tempmin_max">
                Min: {city.temp_min}°{unit === 'metric' ? 'C' : 'F'} | Max: {city.temp_max}°{unit === 'metric' ? 'C' : 'F'}
              </h3>
            </div>
            <div className="wave"></div>
            <div className="wave -two"></div>
            <div className="wave -three"></div>
          </div>
        )}
      </div>
      <div className="recent-searches">
        <h2>Recent Searches</h2>
        <ul>
          {recentSearches.map((recentSearch, index) => (
            <li key={index}>{recentSearch}</li>
          ))}
        </ul>
      </div>
      </div>
    </>
  );
};

export default Tempapp;
