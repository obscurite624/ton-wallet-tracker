import { useEffect, useState } from 'react';
import { supabase } from '../../lib/client';
import useSessionStore from '../../store/session.store';

const Login = () => {
  const user = useSessionStore((state) => state.getUser());

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  useEffect(() => {
    supabase.auth.onAuthStateChange((event, session) => {
      console.log('session', session);
      useSessionStore.setState({ user: session?.user || null });
    });
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: email,
        password: password,
      });
      console.log('data', data);
      if (error) throw error;
    } catch (error) {
      console.error('Error: ', error);
    }
  };

  const logoutSession = async () => {
    await supabase.auth.signOut();
    useSessionStore.setState({ user: null });
  };

  return (
    <>
      <div className='bg-white'>
        {user ? (
          <div className='flex h-screen flex-col items-center justify-center'>
            <div className='max-h-auto mx-auto max-w-xl'>
              <h1 className='text-2xl font-bold mb-5'>Welcome {user.email}</h1>
              <button onClick={logoutSession}>Logout</button>
            </div>
          </div>
        ) : (
          <div className='flex h-screen flex-col items-center justify-center'>
            <div className='max-h-auto mx-auto max-w-xl'>
              <h1 className='text-2xl font-bold mb-5'>Login</h1>
              <form onSubmit={handleSubmit}>
                <input
                  type='email'
                  placeholder='Email'
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className='w-full p-2 mb-4 border border-gray-300 rounded-lg'
                />
                <input
                  type='password'
                  placeholder='Password'
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className='w-full p-2 mb-4 border border-gray-300 rounded-lg'
                />
                <button
                  type='submit'
                  className='w-full p-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600'>
                  Login
                </button>
              </form>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default Login;
