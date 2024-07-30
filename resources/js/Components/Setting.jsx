import React from 'react'
import {motion} from 'framer-motion'

const animation = {
    initial: {opacity : 0, y: 100},
    animate: {opacity: 1, y: 0},
    exit: {opacity: 0, y: 100}
}

export default function Setting({ className }) {
    const logoURL = [
        'https://www.svgrepo.com/show/497505/setting-2.svg', 
        'https://www.svgrepo.com/show/446990/close.svg'
    ];
    
    const [config, setConfig] = React.useState(false);
    const [logo, setLogo] = React.useState(logoURL[0]);
    function handleSetting() {
        if (config) {
            setLogo(logoURL[0]);
            setConfig(!config);
        } else {
            setLogo(logoURL[1]);
            setConfig(!config);
        }
    }
    const hideHistory = () => {
        const history = document.getElementById('history');
        if (history.classList.contains('hidden')) {
            history.classList.remove('hidden');
            return;
        }
        history.classList.add('hidden');
    }
    return (
        <div className={'relative w-fit min-h-10 max-h-10 ' + className}>
             {config && 
                <motion.div variants={animation} initial="initial" animate="animate" exit="exit" className='absolute bg-green-200 outline-1 outline rounded-full h-fit px-3 py-1 duration-300 delay-100 transition-opacity -top-4 left-10 translate-x-full ease-in-out'>
                    <button onClick={hideHistory} className='flex w-fit max-h-10'><img src='https://www.svgrepo.com/show/511020/hide.svg' className='size-5 my-auto' alt="" /> <p className='invisible'>Hi</p> </button>
                </motion.div>
             }

            <button className='m-auto shadow-md bg-green-200 outline-1 outline rounded-full p-1 top-1/2 -translate-y-1/2 -right-10' onClick={handleSetting}>
                <img className='size-5 fill-black' src={ logo } alt="" />
            </button>
        </div>
    );
}
