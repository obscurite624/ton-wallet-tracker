import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/client';
import SavedCard from '../components/SavedCard';
import { FiCreditCard, FiTrash } from 'react-icons/fi';
import SpringModal from '../components/ui/SpringModal';

const Saved = () => {
  const [loading, setLoading] = useState(true);
  const [wallets, setWallets] = useState([]);
  const [selectedWallet, setSelectedWallet] = useState(null);

  // Obtener las wallets guardadas en la BD (funcionalidad no finalizada)
  const fetchSavedWallets = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase.from('savedWallets').select('*');
      if (error) {
        throw error;
      }
      console.log('data', data);
      setWallets(data);
    } catch (error) {
      console.log('error', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSavedWallets();
  }, []);

  const handleWalletClick = (wallet) => {
    setSelectedWallet(wallet);
  };

  const handleAddWallet = async (walletAddress, name, user) => {
    try {
      const { data, error } = await supabase.from('savedWallets').insert([
        {
          walletAddress,
          name,
          user,
        },
      ]);
      if (error) {
        throw error;
      }
      console.log(data);
      setWallets((prev) => [...prev, { walletAddress, name, user }]);
    } catch (error) {
      console.error('Error al añadir la wallet', error);
    }
  };

  const [dataDB, setDataDB] = useState([]);

  const getDataFromDB = async () => {
    try {
      const { data, error } = await supabase.from('jetton').select('*');
      if (error) throw error;
      setDataDB(data);
    } catch (error) {
      console.log(error);
    }
  };

  const handleDeleteWallet = async (walletId) => {
    try {
      const { data, error } = await supabase
        .from('savedWallets')
        .delete()
        .eq('id', walletId);
      if (error) {
        throw error;
      }
      console.log(data);
      setWallets((prev) => prev.filter((wallet) => wallet.id !== walletId));
    } catch (error) {
      console.error('Error al borrar la wallet', error);
    }
  };

  return (
    <div className='p-4'>
      <h1 className='text-4xl font-bold text-center text-gray-800 mb-6'>
        Carteras Guardadas
      </h1>
      <div className='flex justify-center mt-4'>
        <button
          className='bg-green-600 hover:bg-green-700 text-white font-semibold px-6 py-3 rounded-lg shadow-lg'
          onClick={() =>
            handleAddWallet(
              '0x1234' + Math.random().toString(36).substring(7),
              'Wallet ' + Math.floor(Math.random() * 100),
              'User ' + Math.floor(Math.random() * 100)
            )
          }>
          Añadir Nueva Wallet
        </button>
      </div>

      <div className='flex justify-center'>
        <button
          className='bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-3 rounded-lg shadow-lg'
          onClick={fetchSavedWallets}
          disabled={loading}>
          {loading ? 'Cargando...' : 'Obtener Carteras Guardadas'}
        </button>
      </div>

      <div className='mt-8 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6'>
        {wallets.map((wallet, index) => (
          <div
            key={index}
            onClick={() => handleWalletClick(wallet)}
            className='relative'>
            <SavedCard title={wallet.name} user={wallet.user} Icon={FiCreditCard} />
            <FiTrash
              onClick={(e) => {
                e.stopPropagation();
                handleDeleteWallet(wallet.id);
              }}
              className='absolute bottom-2 right-2 text-red-500 text-3xl
              cursor-pointer transition-transform duration-300 hover:scale-110'
            />
          </div>
        ))}
      </div>

      {selectedWallet && (
        <SpringModal
          wallet={selectedWallet}
          isOpen={true}
          setIsOpen={() => setSelectedWallet(null)}
        />
      )}

      <h1 className='text-2xl font-bold'>Data from DB</h1>
      <button onClick={getDataFromDB}>Get data from DB</button>
      <div>
        {dataDB.map((item, index) => (
          <div key={index} className='border border-gray-200 p-4 mt-4'>
            <h2 className='text-xl font-bold'>{item.name}</h2>
            <p>{item.ticker}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Saved;
