import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Navbar as BsNavbar, Nav, Button } from 'react-bootstrap';
import { useAuth } from '../contexts/AuthContext';

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  if (!user || location.pathname === '/login' || location.pathname === '/signup') {
    return null;
  }

  return (
    <div className="navbar-container">
      <BsNavbar bg="dark" variant="dark" expand="lg" className="navbar-content px-4">
        <BsNavbar.Brand as={Link} to="/" className="fw-bold">
          Blog Platform
        </BsNavbar.Brand>
        <BsNavbar.Toggle aria-controls="basic-navbar-nav" />
        <BsNavbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto">
            <Nav.Link as={Link} to="/" active={location.pathname === "/"}>
              Home
            </Nav.Link>
            {user.role === 'author' && (
              <Nav.Link as={Link} to="/author" active={location.pathname === "/author"}>
                Author Dashboard
              </Nav.Link>
            )}
            {user.role === 'admin' && (
              <Nav.Link as={Link} to="/admin" active={location.pathname === "/admin"}>
                Admin Dashboard
              </Nav.Link>
            )}
          </Nav>
          <Nav>
            <Nav.Item className="d-flex align-items-center">
              <span className="text-light me-3">Welcome, {user.username}!</span>
              <Button 
                variant="outline-light"
                size="sm"
                onClick={handleLogout}
              >
                Logout
              </Button>
            </Nav.Item>
          </Nav>
        </BsNavbar.Collapse>
      </BsNavbar>
    </div>
  );
} 