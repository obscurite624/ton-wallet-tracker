import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/client';
import useSessionStore from '../store/session.store';
import { Link, useNavigation } from 'react-router-dom';
import { motion } from 'framer-motion';
import NotAuth from '../pages/NotAuth';

const Saved = () => {
  const user = useSessionStore((state) => state.getUser());

  const handleImageError = (e) => {
    e.target.src = '/src/assets/logo/ton-toncoin-logo.jpg';
  };

  const [jettons, setJettons] = useState([]);
  const [selectedJetton, setSelectedJetton] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // Obtener los watchlist de la base de datos
  const getWatchList = async () => {
    try {
      const { data, error } = await supabase
        .from('watchlist')
        .select('*')
        .eq('user_id', user.id);
      if (error) throw error;
      return data;
    } catch (error) {
      console.log(error);
    }
  };

  // Obtener los Jettons de la base de datos que pertenecen al watchlist
  const getJettonsFromDB = async () => {
    try {
      const data = await getWatchList();
      const jettonIds = data.map((watch) => watch.jetton_id);
      const { data: jettons, error } = await supabase
        .from('jetton')
        .select('*')
        .in('id', jettonIds);
      if (error) throw error;
      setJettons(jettons);
      if (jettons.length > 0) {
        setSelectedJetton(jettons[0]);
        setIsLoading(false);
      } else {
        setIsLoading(false);
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (user) {
      getJettonsFromDB();
    }
  }, [user]);

  return (
    <>
      {user ? (
        <div className='container mx-auto'>
          <h1 className='text-3xl font-bold text-white text-center my-4'>Saved Jettons</h1>

          {isLoading ? (
            <div className='text-center mt-4'>
              <div className='inline-flex w-20 h-20 border-t-2 border-b-2 border-white rounded-full animate-spin'></div>
            </div>
          ) : (
            <div className='flex flex-col mt-4 gap-6 mx-auto'>
              {jettons.length > 0 ? (
                <div className='border-b border-gray-200'>
                  <nav className='-mb-px' aria-label='Tabs'>
                    {jettons.map((jetton, index) => (
                      <button
                        key={index}
                        className={`inline-flex shrink-0 mx-2 items-center gap-2 border-b-2 px-1 pb-4 text-sm font-medium ${selectedJetton === jetton
                            ? 'border-sky-500 text-sky-600'
                            : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
                          }`}
                        onClick={() => setSelectedJetton(jetton)}>
                        <div className='flex items-center gap-2'>
                          <img
                            src={jetton.imageURL}
                            alt={jetton.name}
                            className='w-6 h-6'
                            onError={handleImageError}
                          />
                          <span>{jetton.symbol}</span>
                        </div>
                      </button>
                    ))}
                  </nav>
                </div>
              ) : (
                <div className='text-center'>
                  <p className='text-lg text-gray-600 dark:text-white'>
                    You haven't saved any Jetton in the watchlist.
                  </p>
                  <Link
                    to='/'
                    className='text-blue-500 dark:text-blue-400 hover:underline'>
                    Search a Jetton, save it and come back here.
                  </Link>
                </div>
              )}

              {selectedJetton && (
                <SelectedJettonCard selectedJetton={selectedJetton} />
              )}
            </div>
          )}
        </div>
      ) : (
        <>
          <NotAuth />
        </>
      )}
    </>
  );
};

// Componente Card de Jetton seleccionado en la página saved
export default Saved;

const SelectedJettonCard = ({ selectedJetton }) => {
  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
  };
  const handleImageError = (e) => {
    e.target.src = '/src/assets/logo/ton-toncoin-logo.jpg';
  };

  return (
    <motion.div
      className='p-4 max-w-md mx-auto bg-white rounded-2xl shadow-md overflow-hidden 
  md:max-w-2xl border border-gray-300 mt-4 dark:bg-zinc-900'
      initial='hidden'
      animate='visible'
      variants={cardVariants}
      style={{ transition: 'box-shadow 0.2s' }}
    >
      <div className='md:flex'>
        <div className='p-8'>
          <div className='uppercase tracking-wide text-sm text-indigo-600 font-bold'>
            Symbol
          </div>
          <h2 className='block mt-1 text-lg leading-tight font-medium text-black hover:text-indigo-600 dark:text-white dark:hover:text-indigo-500'>
            ${selectedJetton.symbol}
          </h2>
          <motion.img
            src={selectedJetton.imageURL}
            alt={selectedJetton.name}
            className='w-24 h-24 mt-4 rounded-full bg-gray-400 hover:opacity-75 border-4 border-white dark:border-gray-800'
            onError={handleImageError}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          />
          <div className='mt-4'>
            <p className='text-gray-700 dark:text-white'>Name:</p>
            <p className='text-gray-900 hover:text-indigo-600 dark:text-white dark:hover:text-indigo-500'>
              {selectedJetton.name}
            </p>
          </div>
          <div className='mt-4'>
            <p className='text-gray-700 dark:text-white'>Address:</p>
            <p className='text-gray-900 hover:text-indigo-600 dark:text-white dark:hover:text-indigo-500'>
              {selectedJetton.addressParse}
            </p>
          </div>
          <div className='mt-4'>
            <p className='text-gray-700 dark:text-white'>Total Supply:</p>
            <p className='text-gray-900 hover:text-indigo-600 dark:text-white dark:hover:text-indigo-500'>
              {selectedJetton.totalSupply}
            </p>
          </div>
          <div className='mt-4'>
            <p className='text-gray-700 dark:text-white'>Holders:</p>
            <p className='text-gray-900 hover:text-indigo-600 dark:text-white dark:hover:text-indigo-500'>
              {selectedJetton.holdersCount}
            </p>
          </div>
        </div>
      </div>
    </motion.div>
  );
};
