import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { FaBars, FaTimes } from 'react-icons/fa';
import { supabase } from '../lib/client';
import EncryptButton from './ui/EncryptButton';
import useSessionStore from '../store/session.store';

const NavBar = () => {
  const user = useSessionStore((state) => state.getUser()); // Session Zustand
  const [isLogged, setIsLogged] = useState(false); // Usuario logueado
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false); // Menú mobile abierto

  // Verificar si el usuario está logueado
  useEffect(() => {
    if (user) {
      setIsLogged(true);
    } else {
      setIsLogged(false);
    }
  }, [user]);

  // Toggle del menú mobile
  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  // Cerrar sesión
  const logoutSession = async () => {
    await supabase.auth.signOut();
    useSessionStore.setState({ user: null });
  };

  return (
    <div className='bg-gray-900 text-white shadow-md'>
      <nav className='container mx-auto px-4 sm:px-6 lg:px-8 py-3'>
        <div className='flex justify-between items-center'>
          <Link to={'/'} className='flex items-center space-x-2'>
            <img
              src='/src/assets/logo/ton-toncoin-logo.jpg'
              className='w-12 h-12 rounded-full'
              alt='Logo'
            />
            <span className='text-2xl font-bold'>TonWalletTrack</span>
          </Link>
          <div className='hidden md:flex space-x-4'>
            <Link
              to={'/wallets'}
              className='text-gray-200 hover:bg-gray-800 hover:text-white rounded-md px-3 py-2 text-sm font-medium'>
              Wallets
            </Link>
            <Link
              to={'/saved'}
              className='text-gray-200 hover:bg-gray-800 hover:text-white rounded-md px-3 py-2 text-sm font-medium'>
              Saved
            </Link>
            {user ? (
              <Link to={'/'} onClick={logoutSession}>
                <EncryptButton TARGET_TEXT='Sign Out' />
              </Link>
            ) : (
              <Link to={'/login'}>
                <EncryptButton TARGET_TEXT='Sign In' />
              </Link>
            )}
          </div>
          <button
            onClick={toggleMobileMenu}
            className='md:hidden text-gray-200 hover:bg-gray-800 hover:text-white p-2 rounded-md focus:outline-none'>
            {isMobileMenuOpen ? <FaTimes size={20} /> : <FaBars size={20} />}
          </button>
        </div>

        {isMobileMenuOpen && (
          <div className='md:hidden'>
            <Link
              to={'/wallets'}
              className='block px-3 py-2 text-base font-medium text-gray-200 hover:bg-gray-800 hover:text-white'>
              Wallets
            </Link>
            <Link
              to={'/saved'}
              className='block px-3 py-2 text-base font-medium text-gray-200 hover:bg-gray-800 hover:text-white'>
              Saved
            </Link>
            {user ? (
              <Link
                to={'/'}
                onClick={logoutSession}
                className='block px-3 py-2 text-base font-medium text-red-600 hover:bg-red-700 hover:text-white'>
                Sign Out
              </Link>
            ) : (
              <Link
                to={'/login'}
                className='block px-3 py-2 text-base font-medium text-blue-600 hover:bg-blue-700 hover:text-white'>
                Sign In
              </Link>
            )}
          </div>
        )}
      </nav>
    </div>
  );
};

export default NavBar;
