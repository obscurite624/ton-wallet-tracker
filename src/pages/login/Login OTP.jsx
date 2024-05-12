import { useEffect, useState } from 'react';
import { supabase } from '../../lib/client';
import { Link, useNavigate } from 'react-router-dom';

const Login = () => {
  const navigation = useNavigate();
  const [user, setUser] = useState(null);
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [isOtpSent, setIsOtpSent] = useState(false);

  useEffect(() => {
    supabase.auth.onAuthStateChange((event, session) => {
      setUser(session?.user || null);
    });
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const { data, error } = await supabase.auth.signInWithOtp({
        email: email,
        options: {
          shouldCreateUser: true,
        },
      });
      console.log('data', data);
      if (error) throw error;
      setIsOtpSent(true);
    } catch (error) {
      console.error('Error: ', error);
    }
  };

  const handleOtpSubmit = async (e) => {
    console.log('otp', otp);
    e.preventDefault();
    try {
      const {
        data: { session },
        error,
      } = await supabase.auth.verifyOtp({
        email,
        token: otp,
        type: 'email',
      });

      if (error) throw error;
      console.log('session', session);

      navigation('/');
    } catch (error) {
      console.error('Error: ', error);
    }
  };

  const logoutSession = async () => {
    await supabase.auth.signOut();
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
              {!isOtpSent ? (
                <form onSubmit={handleSubmit} className='mb-8 space-y-3'>
                  <p className='text-xl font-semibold'>Login</p>
                  <input
                    type='email'
                    placeholder='Email'
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className='border border-gray-300 rounded px-3 py-2'
                  />
                  <button
                    type='submit'
                    className='bg-blue-500 text-white px-3 py-2 rounded'>
                    Send OTP
                  </button>
                </form>
              ) : (
                <form onSubmit={handleOtpSubmit} className='mb-8 space-y-3'>
                  <p className='text-xl font-semibold'>Enter OTP</p>
                  <input
                    type='text'
                    placeholder='OTP'
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                    className='border border-gray-300 rounded px-3 py-2'
                  />
                  <button
                    type='submit'
                    className='bg-blue-500 text-white px-3 py-2 rounded'>
                    Verify OTP
                  </button>
                </form>
              )}
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default Login;
