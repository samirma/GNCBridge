'use client'

import ChainBridge from './ChainBridge';
import About from './about';
import { useState } from "react";
import React from 'react';

export default function App() {
  const [state, setState] = useState("home");

  return (
    <div>
        <nav>
            <ul>
                <li><a onClick={() => setState('home')}>Home</a></li>
                <li><a onClick={() => setState('about')}>About</a></li>
                <li><a onClick={() => setState('chainbridge')}>Chain Bridge</a></li>
            </ul>
        </nav>

        <p>Current state: {state}</p>

        {state === 'about' && <About />}
        {state === 'chainbridge' && <ChainBridge />}
    </div>
  );
}
