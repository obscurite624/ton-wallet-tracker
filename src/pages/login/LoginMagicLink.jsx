import { useState, useEffect } from 'react';
import { supabase } from '../../lib/client';
import { Link } from 'react-router-dom';
import useSessionStore from '../../store/session.store';

const LoginMagicLink = () => {
  // const user = useSessionStore((state) => state.getUser());

  const [user, setUser] = useState(null); //! Comentar
  const [email, setEmail] = useState('');
  const [emailSent, setEmailSent] = useState(false); // Estado para verificar si el email ha sido enviado

  useEffect(() => {
    supabase.auth.onAuthStateChange((event, session) => {
      setUser(session); //! Comentar
      // useSessionStore.setState({ user: session?.user || null });
    });
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await supabase.auth.signInWithOtp({
        email,
        options: {
          shouldCreateUser: true,
          emailRedirectTo: 'http://localhost:5173/',
        },
      });
      setEmailSent(true); // Actualiza el estado para mostrar la pantalla de confirmación
      console.log('Response: ', response);
    } catch (error) {
      console.log('Error: ', error);
    }
  };

  const logoutSession = async () => {
    await supabase.auth.signOut();
    // useSessionStore.setState({ user: null });
  };

  if (user) {
    return (
      <div className='bg-gray-800 text-white flex h-screen items-center justify-center'>
        <div className='text-center'>
          <h1>Welcome {user.user.email}</h1>
          <Link to='/'>Go to Home</Link>
          <button onClick={logoutSession}>Logout</button>
        </div>
      </div>
    );
  }

  if (emailSent) {
    return (
      <div className='bg-gray-800 text-white flex h-screen items-center justify-center'>
        <div className='text-center'>
          <h2>We've sent a magic link to your email.</h2>
          <p>Please check your inbox and click the link to log in.</p>
        </div>
      </div>
    );
  }

  return (
    <div className='bg-gray-800 text-white flex h-screen items-center justify-center'>
      <div className='max-w-xl p-4'>
        <form onSubmit={handleSubmit} className='space-y-6'>
          <h2 className='text-xl font-semibold'>Login with Magic Link</h2>
          <p>
            Enter your email, and we'll send a code to your inbox. No need for
            passwords — like magic!
          </p>
          <label htmlFor='email' className='block text-sm font-medium'>
            Email
          </label>
          <input
            id='email'
            type='email'
            className='w-full p-2 bg-gray-700 border border-gray-600 rounded-md text-sm placeholder-gray-400 focus:ring-blue-500 focus:border-blue-500'
            placeholder='mail@example.com'
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <button
            type='submit'
            className='w-full p-3 bg-blue-600 rounded-md hover:bg-blue-700 transition'>
            Send Magic Link
          </button>
        </form>
      </div>
    </div>
  );
};

export default LoginMagicLink;
