import React, { Component } from 'react'

import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Dogs from './components/Dogs'

class App extends Component {
  render() {
    return (
      <BrowserRouter>
        <Routes>
          <Route path='/' element={<Dogs />} />
        </Routes>
      </BrowserRouter>
    )
  }
}

export default App
