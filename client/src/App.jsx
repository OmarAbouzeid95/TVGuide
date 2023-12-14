import './App.css';
import Root from './routes/Root';
import SignIn from './components/SignIn';
import SignUp from './components/SignUp';
import ErrorPage from './routes/ErrorPage';

// routes
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
          path: '*',
          element: <ErrorPage />
        }
      ]
    },
  ]);

  return (
    <div>
      <RouterProvider router={router} />
    </div>
  );
  
};

export default App;
