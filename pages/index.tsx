import type { NextPage } from 'next'
import Head from 'next/head'
const Home: NextPage = () => {
  return (
    <div className="w-full" style={{height: '100vh'}}>
      <Head>
        <title>Create Next App</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      Coming soon. Follow <a className='font-semibold underline' href="https://twitter.com/sonnylazuardi">Twitter</a> for update.
    </div>
  )
}

export default Home
