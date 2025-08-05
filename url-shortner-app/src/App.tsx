import { Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage';
import StatisticsPage from './pages/StatisticsPage';
import RedirectPage from './pages/RedirectPage';
import NotFoundPage from './pages/NotFoundPage';
import Header from './components/Header';
import { Container } from '@mui/material';


function App() {
  return (
    <>
      <Header />
      <Container component="main" sx={{ mt: 4 }}>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/statistics" element={<StatisticsPage />} />
          <Route path="/:shortCode" element={<RedirectPage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </Container>
    </>
  );
}

export default App;