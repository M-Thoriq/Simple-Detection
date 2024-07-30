import React from 'react'
import WebcamML from '../Components/WebcamML'
import Setting from '@/Components/Setting'

export default function ML() {
  return (
    <>
        <WebcamML />
        <div className='fixed right-1/2 translate-x-1/2 bottom-[0.01%] translate-y-[0.01%] '>
            <Setting className='' />
        </div>
    </>
  )
}
