// The editor on its own page, as a host app would set it up: the scope class on <html> (see
// index.html), the stylesheet, and the editor with a sign from useDoorSign().
import React from 'react'
import { createRoot } from 'react-dom/client'
import { DoorSignEditor, useDoorSign } from '../src/index.js'
import '../src/styles/door-sign.css'

const Demo = () => <DoorSignEditor sign={useDoorSign()} />

createRoot(document.getElementById('root')).render(<Demo />)
