import React from 'react';
import { FaStar, FaTrash } from 'react-icons/fa';

const TokenCard = ({ tokenData, onSaved, isSaved, onDelete }) => {
  if (!tokenData) return null;

  return (
    <div className='text-white rounded-lg shadow-lg overflow-hidden'>
  <div className='p-4 flex flex-col items-center'>
    <div className='w-24 h-24 rounded-full overflow-hidden border-4 border-gray-700' style={{ boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)', margin: '-2px' }}>
      <img
        className='w-full h-full object-cover'
        src={tokenData.metadata.image}
        alt={`${tokenData.metadata.name} Logo`}
      />
    </div>
    <div className='text-center mt-4'>
      <h3 className='font-bold text-xl'>
        {'$' + tokenData.metadata.symbol} | {tokenData.metadata.name}
      </h3>
      <p className='text-gray-400'>
        Total Supply:{' '}
        {(tokenData.total_supply / 1e9).toLocaleString(undefined, {
          minimumFractionDigits: 0,
          maximumFractionDigits: 2,
        })}{' '}
        ${tokenData.metadata.symbol} tokens
      </p>
    </div>
  </div>
  <div className='px-6 py-4 text-center'>
    <span className='inline-block bg-gray-700 rounded-full px-3 py-1 text-sm font-semibold text-gray-300 mr-2 mb-2'>
      Holders: {tokenData.holders_count}
    </span>
    <span className='inline-block bg-gray-700 rounded-full px-3 py-1 text-sm font-semibold text-gray-300 mr-2 mb-2'>
      Verification: {"'" + tokenData.verification + "'"}
    </span>

    {isSaved ? (
      <button
        onClick={onDelete}
        className='bg-red-500 hover:bg-red-600 text-white font-bold py-1 px-2 rounded-full inline-flex items-center transition-transform duration-300 ease-in-out hover:scale-110 text-sm'
      >
        <FaTrash />
        <span className='ml-2'>Remove</span>
      </button>
    ) : (
      <button
        onClick={onSaved}
        className='bg-yellow-500 hover:bg-yellow-600 text-white font-bold py-1 px-2 rounded-full inline-flex items-center transition-transform duration-300 ease-in-out hover:scale-110 text-sm'
      >
        <FaStar />
        <span className='ml-2'>Add</span>
      </button>
    )}
  </div>
</div>

  );
};

export default TokenCard;
