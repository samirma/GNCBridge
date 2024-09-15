'use client'

import GNCForm from './GNCForm';
import ChainForm from './ChainForm';
import About from './about';
import MintToken from './MintToken';
import Env from './enviroment';
import { useState } from "react";

export default function App() {
  const [state, setState] = useState("polygon");

  return (
    <div>
        <nav>
            <ul>
                <li><a onClick={() => setState('home')}>Home</a></li>
                <li><a onClick={() => setState('about')}>About</a></li>
                <li><a onClick={() => setState('polygon')}>Polygon</a></li>
                <li><a onClick={() => setState('gnc')}>GNC</a></li>
                <li><a onClick={() => setState('MintToken')}>Mint</a></li>
                <li><a onClick={() => setState('gnc')}>GNC</a></li>
                <li><a onClick={() => setState('MintToken')}>Mint</a></li>
            </ul>
        </nav>

        <p>Current state: {state}</p>

        {state === 'about' && <About />}
        {state === 'gnc' && <GNCForm />}
        {state === 'polygon' && <ChainForm />}
        {state === 'MintToken' && <MintToken />}

        <Env/>

    </div>
  );
}
