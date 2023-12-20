import './App.css';
import { useContext } from 'react';
// components
import Root from './routes/Root';
import SignIn from './components/SignIn';
import SignUp from './components/SignUp';

// mantine
import { MantineProvider } from '@mantine/core';

// routes
import ErrorPage from './routes/ErrorPage';
import TrendingPage from './routes/TrendingPage';
import SearchPage from './routes/SearchPage';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';

// functions
import { searchMovies } from './functions/movieFunctions';

const App = () => {


  const router = createBrowserRouter([
    {
      path: '/',
      element: <Root />,
      children: [
        {
          path: 'signIn',
          element: <SignIn />
        },
        {
          path: 'signUp',
          element: <SignUp />
        },
        {
          path: '/search/:mode/:keyword',
          element: <SearchPage />,
          loader: async ({params}) => {
            const { mode, keyword } = params;
            console.log('mode: ', mode, ' keyword: ', keyword);
            return searchMovies(mode, keyword);
          }
        },
        {
          path: '/trending',
          element: <TrendingPage />
        },
        {
          path: '*',
          element: <ErrorPage />
        }
      ]
    },
  ]);

  return (
    <div>
      <MantineProvider withGlobalStyles withNormalizeCSS>
        <RouterProvider router={router} />
      </MantineProvider>
    </div>
  );
  
};

export default App;
