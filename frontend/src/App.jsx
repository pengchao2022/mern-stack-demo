import React from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import NoteDetailPage from './pages/NoteDetailPage.jsx';
import CreatePage from './pages/CreatePage.jsx';  
import HomePage from './pages/HomePage.jsx';
import EditPage from './pages/EditPage.jsx'; // 需要创建这个组件

const App = () => {
  return (
    <div>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/create" element={<CreatePage />} />
          <Route path="/note/:id" element={<NoteDetailPage />} />
          <Route path="/edit/:id" element={<EditPage />} />
        </Routes>
      </BrowserRouter>
    </div>
  )
}

export default App