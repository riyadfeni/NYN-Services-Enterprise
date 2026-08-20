import { NavLink, useNavigate } from 'react-router-dom';
import { logout } from '../services/auth';

const links = [
  { to: '/dashboard', label: 'Dashboard' },
  { to: '/new', label: 'New Consignment' },
  { to: '/history', label: 'History' },
  { to: '/search', label: 'Search' },
  { to: '/settings', label: 'Settings' },
];

export default function Navbar() {
  const navigate = useNavigate();

  async function handleLogout() {
    await logout();
    navigate('/login');
  }

  return (
    <div className="sidebar no-print">
      <div className="sidebar-brand">NYN CN SYSTEM</div>
      <nav>
        {links.map((l) => (
          <NavLink key={l.to} to={l.to} className={({ isActive }) => (isActive ? 'active' : '')}>
            {l.label}
          </NavLink>
        ))}
        <button onClick={handleLogout}>Logout</button>
      </nav>
    </div>
  );
}
