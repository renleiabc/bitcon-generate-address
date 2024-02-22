import { Outlet, NavLink, useNavigation } from 'react-router-dom';
import reactLogo from '@/assets/react.svg';
import viteLogo from '/vite.svg';
import bitcoinLogo from '@/assets/bitcoin.png';
function Layout() {
  const navigation = useNavigation();

  return (
    <div>
      <div className="flex justify-around">
        <a href="https://vitejs.dev" target="_blank" rel="noreferrer">
          <img src={viteLogo} className="logo" alt="Vite logo" />
        </a>
        <a href="https://bitcoin.org" target="_blank" rel="noreferrer">
          <img src={bitcoinLogo} className="logo" alt="Vite logo" />
        </a>
        <a href="https://react.dev" target="_blank" rel="noreferrer">
          <img src={reactLogo} className="logo react" alt="React logo" />
        </a>
      </div>
      <div style={{ position: 'fixed', top: 0, right: 0 }}>
        {navigation.state !== 'idle' && <p>Navigation in progress...</p>}
      </div>
      <nav>
        <ul className="flex justify-between">
          <li>
            <NavLink to="/">Home</NavLink>
          </li>
          <li>
            <NavLink to="/about">About</NavLink>
          </li>
          <li>
            <NavLink to="/details/1/noah">Details</NavLink>
          </li>
          <li>
            <NavLink to="/detailsother?id=2&name=Tom&age=35&gender=male">DetailsOther</NavLink>
          </li>
        </ul>
      </nav>
      <hr />
      <Outlet />
    </div>
  );
}

export default Layout;
