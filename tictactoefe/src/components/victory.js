import React, { Fragment } from 'react'
import './victory.css'

export default function Victory({winner, onClick}) {
  return (
    <body>
        <div class="victory"></div>
        <div class="imposter">
            <div class="spacesuit">
            <div class="chest-and-head"></div>
            <div class="legs"></div>
            <div class="arm"></div>
            <div class="helmet-glass"></div>
            </div>
        </div>
        <button style={{display:"flex", verticalAlign: "center", padding: '10px', marginBottom: "10px" }} onClick={() => onClick()}>
          {winner ? "Restart Game" : "Start Game"}
        </button>
        <div class="background"></div>
        <div class="name"></div>
        
    </body>
  )
}
