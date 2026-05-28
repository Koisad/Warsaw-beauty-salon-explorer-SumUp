import { BrowserRouter, Routes, Route} from 'react-router-dom';
import SalonExplorer from './pages/SalonExplorer';
import SalonDetails from './pages/SalonDetails';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<SalonExplorer />}/>
        <Route path="/salon/:id" element={<SalonDetails />} />
      </Routes>  
    </BrowserRouter>
  )
}