'use client'

import GNCForm from './GNCForm';
import PolygonForm from './PolygonForm';
import About from './about';
import MintToken from './MintToken';
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
            </ul>
        </nav>

        <p>Current state: {state}</p>

        {state === 'about' && <About />}
        {state === 'gnc' && <GNCForm />}
        {state === 'polygon' && <PolygonForm />}
        {state === 'MintToken' && <MintToken />}
    </div>
  );
}
