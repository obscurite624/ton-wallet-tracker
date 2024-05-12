import React, { useState, useEffect } from 'react';
import CoinList from './CoinList';
import { FaSearch } from 'react-icons/fa';
import { fetchTonAPI } from '../lib/functions';
import NotAuth from '../pages/NotAuth';

const HomeWallets = () => {
  const [wallet, setWallet] = useState(''); // Wallet a buscar
  const [coins, setCoins] = useState([]); // Datos de las monedas
  const [inputValue, setInputValue] = useState(''); // Valor del input en el SearchBar

  const handleInputChange = (e) => {
    setInputValue(e.target.value);
  };

  const handleSearchClick = () => {
    if (inputValue.trim() !== '') {
      setWallet(inputValue.trim());
    }
  };

  // Fetch de la API
  const fetchData = async () => {
    try {
      const { data } = await fetchTonAPI(
        `/accounts/${wallet}`,
        '/jettons?currencies=usd'
      );
      const filteredArray = data.balances.filter((item) => item.balance !== 0);
      const newCoins = filteredArray.map((item) => {
        return {
          ...item,
          price: {
            prices: {
              USD: item.price.prices.USD * (item.balance / 1e9),
            },
          },
        };
      });

      console.log(newCoins);

      const filteredCoins = newCoins.filter((item) => item.price.prices.USD > 0);
      filteredCoins.sort((a, b) => b.price.prices.USD - a.price.prices.USD);
      setCoins(filteredCoins);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchData();
  }, [wallet]);

  // Si el usuario está logueado, mostrar el contenido de la página, si no pues el unauthorized
  const [isLogged, setIsLogged] = useState(false);

  return (
    <>
      {!isLogged ? (
        <div className='container mx-auto'>
          <div className='flex justify-center mx-auto p-4 rounded-lg mt-4'>
            <div className='relative w-full md:w-1/2 hover:w-3/4 transition-all duration-300 ease-in-out'>
              <input
                type='text'
                className='w-full p-2 pl-4  pr-8 rounded-lg bg-gray-700 text-white border border-gray-600 focus:outline-none'
                placeholder='Dive into a wallet holdings by searching it here'
                value={inputValue}
                onChange={handleInputChange}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    handleSearchClick();
                  }
                }}
              />

              <button
                onClick={handleSearchClick}
                className='absolute inset-y-0 right-0 flex items-center px-4 text-white bg-blue-600 rounded-r-lg hover:bg-blue-500'>
                <FaSearch />
              </button>
            </div>
          </div>

          <div className='p-4 bg-gray-900 text-white rounded-lg mt-4'>
            <div>
              <CoinList coins={coins} />
            </div>
          </div>
        </div>
      ) : (
        <>
          <NotAuth />
        </>
      )}
    </>
  );
};

export default HomeWallets;
