import { createBrowserRouter } from 'react-router-dom';
import Layout from '@/pages/Layout';
import Home from '@/pages/Home';
import NoMatch from '@/pages/NoMatch';

import type { RouteObject } from 'react-router-dom';

const Routes: RouteObject[] = [
  {
    path: '/',
    element: <Layout />,
    children: [
      {
        index: true,
        element: <Home />,
        action: () => {
          return {
            title: '首页'
          };
        }
      },
      {
        path: 'about',
        lazy: () => import('@/pages/About'),
        action: () => {
          return {
            title: '关于'
          };
        }
      },
      {
        path: 'details/:id/:name',
        // Single route in lazy file
        lazy: () => import('@/pages/Details')
      },
      {
        path: 'detailsother',
        async lazy() {
          const { DetailsOther } = await import('@/pages/Detailsother');
          return { Component: DetailsOther };
        }
      }
    ]
  },
  {
    path: '*',
    element: <NoMatch />
  }
];
const Router = createBrowserRouter(Routes);
export default Router;
