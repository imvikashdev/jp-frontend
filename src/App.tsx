import { BrowserRouter, Route, Routes } from 'react-router-dom';
import './App.css';
import Navbar from './components/Navbar';
import EventList from './pages/EventList';
import CreateEvent from './pages/CreateEvent';
import ErrorBoundaryWrapper from './components/ErrorBoundary';
import { Toaster } from './components/ui/toaster';

function App() {
  return (
    <div className="container mx-auto p-4">
      <ErrorBoundaryWrapper>
        <BrowserRouter>
          <Navbar>
            <Toaster />
            <Routes>
              <Route path="/" element={<EventList />} />
              <Route path="/create-event" element={<CreateEvent />} />
            </Routes>
          </Navbar>
        </BrowserRouter>
      </ErrorBoundaryWrapper>
    </div>
  );
}

export default App;
