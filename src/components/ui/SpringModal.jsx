import { AnimatePresence, motion } from 'framer-motion';
import { FiAlertCircle } from 'react-icons/fi';

const SpringModal = ({ wallet, isOpen, setIsOpen }) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={() => setIsOpen(false)}
          className='bg-slate-900/70 backdrop-blur p-8 fixed inset-0 z-50 grid place-items-center overflow-y-scroll cursor-pointer'>
          <motion.div
            initial={{ scale: 0, rotate: '12.5deg' }}
            animate={{ scale: 1, rotate: '0deg' }}
            exit={{ scale: 0, rotate: '0deg' }}
            onClick={(e) => e.stopPropagation()}
            className='bg-gradient-to-br from-primary to-surface text-white p-6 rounded-lg w-full max-w-lg shadow-xl cursor-default relative overflow-hidden'>
            <FiAlertCircle className='text-white/10 rotate-12 text-[250px] absolute z-0 -top-24 -left-24' />
            <div className='relative z-10'>
              <div className='bg-white w-16 h-16 mb-2 rounded-full text-3xl text-primary grid place-items-center mx-auto'>
                <FiAlertCircle />
              </div>

              <h1 className='text-2xl font-bold text-center mb-4'>{wallet.id}</h1>
              <h3 className='text-3xl font-bold text-center mb-2'>{wallet.name}</h3>

              <p className='text-center mb-6'>
                Esta es tu dirección de billetera:{' '}
                <span className='font-semibold'>{wallet.walletAddress}</span>
              </p>
              <div className='flex gap-2'>
                <button
                  onClick={() => setIsOpen(false)}
                  className='bg-transparent hover:bg-white/10 transition-colors text-white font-semibold w-full py-2 rounded'>
                  Cerrar
                </button>
                <button
                  onClick={() => setIsOpen(false)}
                  className='bg-white hover:opacity-90 transition-opacity text-surface font-semibold w-full py-2 rounded'>
                  Okey! Sácame de aquí
                </button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default SpringModal;
