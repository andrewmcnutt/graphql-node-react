import { BrowserRouter, Route, Navigate, Routes } from 'react-router-dom';

import AuthPage from './pages/Auth';
import BookingsPage from './pages/Bookings';
import EventsPage from './pages/Events';
import MainNavigation from './components/Navigation/MainNavigation'

import './App.css';
import React from 'react';

function App() {
  return (
    <BrowserRouter>
      <React.Fragment>
        <MainNavigation />
        <main className="main-content">
          <Routes>
            <Route path="/" element={<Navigate replace to="/auth" />}/>
            <Route path="/auth" element={<AuthPage />}/>
            <Route path="/bookings" element={<BookingsPage />}/>
            <Route path="/events" element={<EventsPage />}/>
          </Routes>
        </main>
      </React.Fragment>
    </BrowserRouter>
  );
}

export default App;
