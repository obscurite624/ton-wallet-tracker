import React, { useEffect, useState } from 'react';
import { FaSearch } from 'react-icons/fa';
import TokenCard from './TokenCard';
import { fetchTonAPIJetton, fetchTonAPITokens } from '../lib/functions';
import shiningCoin from '../assets/img/shiningCoin.gif';
import { supabase } from '../lib/client';
import useSessionStore from '../store/session.store';
import { notify } from '../lib/toast';

const Home = () => {
  const user = useSessionStore((state) => state.getUser()); // Session Zustand

  const [tokenData, setTokenData] = useState(null); // Datos del token
  const [searchPerformed, setSearchPerformed] = useState(false); // Búsqueda realizada
  const [token, setToken] = useState(''); // Token a buscar
  const [wallets, setWallets] = useState([]); // Wallets del token
  const [isSavedOnWatchlist, setIsSavedOnWatchlist] = useState(false); // Guardado en watchlist
  const [watchlist, setWatchlist] = useState([]); // Watchlist del usuario
  const [total_supplyFromAPI, setTotal_supplyFromAPI] = useState(0); // Total supply del token

  // Manejar la búsqueda click de búsqueda
  const handleSearchClick = async () => {
    if (token.trim() !== '') {
      setSearchPerformed(true);
      const response = await fetchTonAPITokens(token.trim());

      const formatedWallets = response.map((item) => {
        return {
          ...item,
          balance: item.balance / 1e9,
        };
      });

      setWallets(formatedWallets);
      const res = await fetchTonAPIJetton(token.trim());
      setTotal_supplyFromAPI(res.data.total_supply / 1e9);
      setTokenData({ ...res.data, addressParse: token });
      const tokenToSave = { ...res.data, addressParse: token };
      await saveInDatabase(tokenToSave);
    } else {
      setSearchPerformed(false);
    }
  };

  // Guardar en la base de datos
  const saveInDatabase = async (jettonFromAPI) => {
    try {
      const { data, error } = await supabase.from('jetton').insert([
        {
          address: jettonFromAPI.metadata.address,
          totalSupply: jettonFromAPI.total_supply / 1e9,
          name: jettonFromAPI.metadata.name,
          symbol: jettonFromAPI.metadata.symbol,
          imageURL: jettonFromAPI.metadata.image,
          verification: jettonFromAPI.verification,
          holdersCount: jettonFromAPI.holders_count,
          addressParse: jettonFromAPI.addressParse || token,
        },
      ]);
      if (error) throw error;
      return data;
    } catch (error) {
      console.error(error);
    } finally {
      const data = await searchInDatabase(token);
      const isSaved = watchlist.find((item) => item.jetton_id === data[0].id);
      if (isSaved) {
        setIsSavedOnWatchlist(true);
      }
    }
  };

  // Buscar en la base de datos
  const searchInDatabase = async (token) => {
    try {
      const { data, error } = await supabase
        .from('jetton')
        .select('*')
        .eq('addressParse', token);

      if (error) throw error;

      return data;
    } catch (error) {
      console.error(error);
    }
  };

  // Guardar en watchlist
  const saveInWatchlist = async (token, user_id) => {
    try {
      const data = await searchInDatabase(token);

      if (data.length > 0) {
        const res = await supabase.from('watchlist').insert([
          {
            jetton_id: data[0].id,
            user_id: user_id,
          },
        ]);
        notify('Token saved in watchlist', 'success');
        setIsSavedOnWatchlist(true);
      }
    } catch (error) {
      console.log(error);
      notify('Error saving token in watchlist', 'error');
    }
  };

  // Eliminar de watchlist
  const deleteFromWatchlist = async () => {
    try {
      const allJettons = await searchInDatabase(token);

      const jettonToDelete = watchlist.find(
        (item) => item.jetton_id === allJettons[0].id
      );

      const { data, error } = await supabase
        .from('watchlist')
        .delete()
        .eq('id', jettonToDelete.id)
        .eq('user_id', user.id);

      if (error) throw error;

      setIsSavedOnWatchlist(false);
      notify('Token deleted from watchlist', 'success');
    } catch (error) {
      console.log(error);
      notify('Error deleting token from watchlist', 'error');
    }
  };

  // Obtener el watchlist del usuario
  const getWatchList = async () => {
    try {
      const { data, error } = await supabase
        .from('watchlist')
        .select('*')
        .eq('user_id', user.id);
      if (error) throw error;
      setWatchlist(data);
      return data;
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (user) {
      getWatchList();
    }
  }, [user]);

  useEffect(() => { }, [tokenData]);

  return (
    <>
      <div className='container mx-auto p-6'>
        <div className='flex justify-center mx-auto p-4 rounded-lg mt-4'>
          <div className='relative w-full md:w-1/2 hover:w-3/4 transition-all duration-300 ease-in-out'>
            <input
              type='text'
              className='w-full p-2 pl-4 pr-8 rounded-lg bg-gray-700 text-white border border-gray-600 focus:outline-none'
              placeholder='Search by pasting here the Jetton CA'
              value={token}
              onChange={(e) => setToken(e.target.value)}
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

        {!searchPerformed ? (
          <div className='text-center mt-16'>
            {' '}
            <img src={shiningCoin} alt='Search animation' className='mx-auto' />
            <p className='text-white mt-4'>
              Paste a coin contract and dive into its holders 👀
            </p>
          </div>
        ) : (
          <>
            {tokenData ? (
              <div className='mt-6 relative'>
                <div className='flex justify-center items-center bg-gray-900 rounded-lg shadow-xl p-4  border border-gray-800'>
                  <TokenCard
                    isSaved={isSavedOnWatchlist}
                    tokenData={tokenData}
                    onSaved={() => saveInWatchlist(tokenData.addressParse, user.id)}
                    onDelete={() => deleteFromWatchlist()}
                  />
                </div>
              </div>
            ) : (
              <div className='mt-6'>
                <h3 className='text-2xl font-bold text-white'>Searching Tokens</h3>
              </div>
            )}

            {wallets.length > 0 && (
              <div className='mt-6'>
                <h3 className='text-2xl font-bold text-white'>Wallets</h3>
                <div className='mt-4 bg-gray-900 rounded-lg shadow-xl p-4'>
                  {wallets.map((item, idx) => (
                    <div
                      key={idx}
                      className='flex justify-between items-center py-4 border-b border-gray-700 last:border-b-0'>
                      <div className='text-left'>
                        <p className='text-sm font-bold text-white'>
                          #{idx + 1}
                          {item.owner.name ? ` - ${item.owner.name}` : ''}
                        </p>
                        <button
                          onClick={() =>
                            window.open(
                              `https://tonviewer.com/${item.owner.address}`,
                              '_blank'
                            )
                          }
                          className='px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 text-sm focus:outline-none transition ease-in-out duration-300 hover:scale-105 focus:ring-2 focus:ring-blue-300'
                          style={{
                            fontSize: '0.875rem',
                            padding: '8px 12px',
                            minWidth: '10px',
                            maxWidth: '100%'
                          }}
                        >
                          View in TonViewer
                        </button>
                      </div>
                      <div className='text-right'>
                        <p className='text-sm text-white'>
                          {item.balance.toLocaleString(undefined, {
                            minimumFractionDigits: 0,
                            maximumFractionDigits: 2,
                          })}
                        </p>
                        <p className='text-sm text-white'>
                          Tokens
                        </p>
                      </div>
                      <div>
                        {tokenData && (
                          <p className='text-sm text-white'>
                            {((item.balance / total_supplyFromAPI) * 100).toFixed(2)}%
                          </p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </>
  );
};

export default Home;
