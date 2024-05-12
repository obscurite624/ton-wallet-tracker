import React from 'react';
import { BackgroundBox } from '../components/ui/BackgroundBox';

const NotAuth = () => {
  const renderBody = (
    <div className='flex flex-col items-center'>
      <h1 className='md:text-2xl lg:text-7xl font-medium text-center bg-clip-text text-transparent bg-gradient-to-b from-neutral-100 to-neutral-400 pointer-events-none'>
        You are not authorized to view this page
      </h1>

      <h3 className='md:text-lg lg:text-2xl font-medium text-center bg-clip-text text-transparent bg-gradient-to-b from-neutral-100 to-neutral-400 pointer-events-none my-6'>
        Please log in to view this page
      </h3>

      <img
        src='https://http.cat/images/401.jpg'
        alt='Unauthorized'
        className='w-auto h-96'
      />
    </div>
  );

  return (
    <>
      {/* Version consume recursos */}
      <div>
        <BackgroundBox body={renderBody} />
      </div>

      {/* Version menos recursos ⬇️ */}
      {/* <div>{renderBody}</div> */}
    </>
  );
};

export default NotAuth;
