import { Routes, Route } from 'react-router-dom';
import Navbar from './components/NavBar.jsx';
import Login from './pages/login/Login.jsx';
import Home from './components/Home.jsx';
import LoginMagicLink from './pages/login/LoginMagicLink.jsx';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Saved from './pages/Saved.jsx';
import NotAuth from './pages/NotAuth.jsx';
import { useEffect } from 'react';
import { supabase } from './lib/client';
import useSessionStore from './store/session.store.js';
import HomeWallets from './components/HomeWallets.jsx';
import NotFound from './pages/NotFound.jsx';

function App() {
  useEffect(() => {
    supabase.auth.onAuthStateChange((event, session) => {
      useSessionStore.setState({ user: session?.user || null });
    });
  }, []);

  return (
    <>
      <Navbar />

      <div className='dark:bg-rgb(24, 24, 27)'>
        <ToastContainer />
        <Routes>
          <Route path='/' element={<Home />} />
          <Route path='/saved' element={<Saved />} />
          <Route path='/login' element={<LoginMagicLink />} />
          <Route path='/login-with-password' element={<Login />} />
          <Route path='*' element={<NotFound />} />
          <Route path='/not-auth' element={<NotAuth />} />
          <Route path='/wallets' element={<HomeWallets />} />
        </Routes>
      </div>
    </>
  );
}

export default App;
