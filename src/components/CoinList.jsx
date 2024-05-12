import React from 'react';
import { CoinCard } from './CoinCard';
import { motion, AnimatePresence } from 'framer-motion';

const CoinList = ({ coins }) => {
  if (coins.length === 0 || coins === undefined || coins === null) {
    return (
      <h1 className='text-white bg-gray-800 p-5 rounded-lg shadow'>No coins</h1>
    );
  }

  return (
    <>
      <h1 className='text-3xl font-bold text-white bg-gray-900 p-5 rounded-lg shadow-lg'>
        Coin List
      </h1>
      <div className='p-5 bg-gray-900'>
        {coins && (
          <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4'>
            <AnimatePresence>
              {coins.map((item, index) => (
                <motion.div
                  key={index}
                  layoutId={`card-container-${index}`}
                  initial={{ opacity: 0, scale: 0.5 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.5 }}
                  transition={{ duration: 0.3, delay: index * 0.3 }}
                  className='flex justify-center'
                  role='listitem'
                  aria-label={`Coin card for ${item.jetton.name}`}>
                  <CoinCard coin={item} />
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}
      </div>
    </>
  );
};

export default CoinList;
