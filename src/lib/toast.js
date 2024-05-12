import { Bounce, toast } from 'react-toastify';

// Notificación
export const notify = (message, type) => {
  toast(message, {
    type: type,
    position: 'top-right',
    autoClose: 1500,
    hideProgressBar: false,
    closeOnClick: false,
    pauseOnHover: true,
    draggable: true,
    progress: undefined,
    theme: 'dark', // 'dark' or 'light'
    transition: Bounce,
  });
};
