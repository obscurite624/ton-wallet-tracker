import React from 'react';
import { fetchTonAPIParse } from '../lib/functions';
import { FaCopy, FaProjectDiagram } from 'react-icons/fa';
import { notify } from '../lib/toast';

export const CoinCard = ({ coin }) => {
  const copyContract = async (address) => {
    try {
      const { data } = await fetchTonAPIParse(address);
      navigator.clipboard.writeText(data.bounceable.b64url);
      notify('Contract copied to clipboard', 'success');
    } catch (error) {
      console.error(error);
      notify('Error copying contract', 'error');
    }
  };

  const openGraphic = async (address) => {
    try {
      const { data } = await fetchTonAPIParse(address);
      window.open(
        `https://www.geckoterminal.com/es/ton/pools/${data.bounceable.b64url}`,
        '_blank'
      );
    } catch (error) {
      console.error(error);
    }
  };

  const handleImageError = (e) => {
    e.target.src = '/src/assets/img/nopfpdefault.png';
  };

  return (
    <div className='w-full max-w-sm bg-gray-900 rounded-lg shadow-md transition-shadow duration-300 ease-in-out hover:shadow-2xl border border-gray-700'>
      <div className='flex flex-col justify-between h-full p-5 text-white'>
        <div className='flex items-center justify-center flex-col'>
          <img
            className='w-24 h-24 mb-4 rounded-full bg-gray-700 border border-gray-600'
            src={coin.jetton.image}
            alt={coin.jetton.name}
            onError={handleImageError}
          />
          <h5 className='mb-2 text-2xl font-semibold tracking-tight'>
            {coin.jetton.name} | ${coin.jetton.symbol}
          </h5>
          <span className='text-lg font-normal'>
            {coin.balance % 1e9 === 0
              ? (coin.balance / 1e9).toFixed(0)
              : (coin.balance / 1e9).toFixed(2)}
          </span>

          <span className='text-lg font-normal'>
            ${coin.price.prices.USD.toFixed(2)}
          </span>
        </div>

        <div className='flex mt-5 space-x-3 justify-center'>
          <button
            title='Open GeckoTerminal chart'
            onClick={() => openGraphic(coin.jetton.address)}
            className='px-4 py-2 text-sm font-medium text-white bg-blue-700 rounded-lg border border-blue-600 flex items-center justify-center space-x-1 
            hover:bg-blue-800 transform transition duration-300 ease-in-out'>
            <FaProjectDiagram className='inline-block mr-2' />
            Chart
          </button>
          <button
            title='Copy contract'
            onClick={() => copyContract(coin.jetton.address)}
            className='px-4 py-2 text-sm font-medium text-white bg-gray-800 rounded-lg border border-gray-700 flex items-center justify-center space-x-1
            hover:bg-gray-900 transform transition duration-300 ease-in-out'>
            Contract
            <FaCopy className='inline-block ml-2' />
          </button>
        </div>
      </div>
    </div>
  );
};
