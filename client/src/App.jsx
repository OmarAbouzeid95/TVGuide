import './App.css';

// components
import Root from './routes/Root';
import SignIn from './components/SignIn';
import SignUp from './components/SignUp';
import MovieDetails from './components/MovieDetails';

// routes
import ErrorPage from './routes/ErrorPage';
import TrendingPage from './routes/TrendingPage';
import PopularPage from './routes/PopularPage';
import SearchPage from './routes/SearchPage';
import TopRatedPage from './routes/TopRatedPage';
import UpcomingPage from './routes/UpcomingPage';
import HomePage from './routes/HomePage';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';

// functions
import { searchMovies } from './functions/movieFunctions';
import { fetchCast, fetchTrailer } from './functions/movieFunctions';

const App = () => {


  const router = createBrowserRouter([
    {
      path: '/',
      element: <Root />,
      children: [
        {
          path: '',
          element: <HomePage />
        },
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
            return searchMovies(mode, keyword);
          },
          // handle: {
          //   crumbName: 'Search'
          // }
        },
        {
          path: '/trending',
          element: <TrendingPage />
        },
        {
          path: '/popular/:mode',
          element: <PopularPage />
        },
        {
          path: '/top-rated/:mode',
          element: <TopRatedPage />
        },
        {
          path: '/upcoming/:mode',
          element: <UpcomingPage />
        },
        {
          path: '/show-details/:mode/:title/:id/:description/:rating/:date/:genres/:poster',
          element: <MovieDetails />,
          loader: async ({params}) => {
            const { mode, id, title, description, rating, date, genres, poster } = params;
            const cast = await fetchCast(mode, id);
            const trailer = await fetchTrailer(mode, id);
            return { cast, trailer, id, title, description, rating, date, genres, poster };
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
