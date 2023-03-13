import type { NextPage } from 'next'
import Head from 'next/head'
import { ColorSet } from './camera';
import { useState } from 'react';
const Home: NextPage = () => {
    const [colorSet, setColorSet] = useState<ColorSet[]>([]);
  return (
    <div className="w-full" style={{height: '100vh'}}>
      <Head>
        <title>Create Next App</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div className='flex flex-1 justify-center items-center bg-black text-white' style={{height: '100vh'}}>
        
      </div>
    </div>
  )
}

export default Home
