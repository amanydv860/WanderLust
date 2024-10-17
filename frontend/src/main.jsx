
import { createRoot} from 'react-dom/client'
import './index.css'
import { BrowserRouter as Router } from 'react-router-dom'
import { AuthProvider } from './AuthContext';
import ProjectRoutes from './Routes';





createRoot(document.getElementById('root')).render(
  <AuthProvider>
  <Router>
    <ProjectRoutes />
  </Router>
</AuthProvider>
)
