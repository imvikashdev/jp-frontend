import { BrowserRouter, Route, Routes } from 'react-router-dom';
import './App.css';
import Navbar from './components/Navbar';
import EventList from './pages/EventList';
import CreateEvent from './pages/CreateEvent';

function App() {
  return (
    <div className="container mx-auto p-4">
      <BrowserRouter>
        <Navbar>
          <Routes>
            <Route path="/" element={<EventList />} />
            <Route path="/create-event" element={<CreateEvent />} />
          </Routes>
        </Navbar>
      </BrowserRouter>
    </div>
  );
}

export default App;
