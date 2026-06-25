import Navbar from './pages/Navbar.tsx';
import { AppRoutes } from './AppRoutes.tsx';

export const App = () => (
  <div className='d-flex flex-column min-vh-100 bg-light'>
    <Navbar />
    <div className='container flex-grow-1'>
      <AppRoutes />
    </div>
  </div>
)