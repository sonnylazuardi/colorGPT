import type { NextPage } from 'next'
import Head from 'next/head'
import CameraColorPick, { FacingMode } from '../src/components/Camera'
import { useState } from 'react'
import { rgbToHex } from '../src/utils'

export interface ColorSet {
  color: string;
  hex: string;
}

export const PASSKEY = 'start';

const App: NextPage = () => {
  const [colorSet, setColorSet] = useState<ColorSet[]>([]);
  const [unlocked, setUnlocked] = useState(false);
  const [color, setColor] = useState('#888888');
  const renderApp = () => {
    return (
      <>
      <div className='flex flex-1 justify-center items-center bg-black' style={{height: '100vh'}}>
        <div className='w-96 h-96 rounded-3xl overflow-hidden'>
          <CameraColorPick facingMode={FacingMode.environment} onColor={(value: any) => {
            setColor(rgbToHex(value.r, value.g, value.b).toUpperCase());
          }} onTakePhoto={() => {}} />
        </div>
      </div>
      
      <div className='absolute top-0 left-0 w-full flex justify-center items-center' style={{height: '100vh'}}>
        <div className='width-[1px] height-[1px] rounded-full relative flex justify-center items-center' style={{background: color}}>
          <div className='absolute -top-16 p-3 rounded-md backdrop-blur-xl bg-black/30 text-white font-semibold shadow-black/90 shadow-xl flex flex-row items-center space-x-4 border border-white/10 ring-1 ring-black/70'>
          
            <div className='h-8 w-8 rounded-full border border-white/20 ring-1 ring-black/40' style={{background: color}}></div>
            <div className='w-20'>
            {color}
            </div>
          </div>
          <div className="w-0 h-0 absolute top-[-6px] border-l-[10px] border-l-transparent border-t-[10px] border-t-white/30 border-r-[10px] border-r-transparent shadow-black/90 shadow-xl"></div>
          <button className='w-20 h-20 absolute top-64 border-4 border-blue-500 flex justify-center items-center rounded-full' onClick={async () => {
            const req = await fetch(`/api/color?hex=${color.replace('#', '')}&passkey=${PASSKEY}`);
            const result = await req.json();
            setColorSet((v) => ([...v, result]));
          }}>
            <div className='w-16 h-16 bg-white rounded-full'>

            </div>
          </button>
        </div>
      </div>
      
      <div className='h-20 overflow-x-auto overflow-y-hidden top-20 absolute w-full p-4'>
        <div className='flex flex-row  items-center text-white'>
            {colorSet.map((v, i) => {
              return (
                <div key={i} className='flex flex-row space-x-2 items-center mr-4'>
                  <div className='w-3 h-3 rounded-full' style={{backgroundColor: v.hex}}></div> 
                  <div className='truncate w-32'>{v.color}</div>
                </div>
              )
            })}
        </div>
      </div>
      </>
    )
  }

  return (
    <div className="w-full" style={{height: '100vh'}}>
      <Head>
        <title>Create Next App</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      {unlocked ? renderApp() : (
        <div className='flex flex-1 justify-center items-center bg-black text-neutral-400' style={{height: '100vh'}}> Passkey
      <input type="password" className='border border-neutral-400' onBlur={e => {
        if (e.target.value === PASSKEY) {
            setUnlocked(true);
        }
      }} />
      </div>
      )}
    </div>
  )
}

export default App
