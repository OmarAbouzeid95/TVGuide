import './App.css';

// components
import Root from './routes/Root';
import SignIn from './components/SignIn';
import SignUp from './components/SignUp';
import MovieDetails from './components/MovieDetails';

// mantine
import { MantineProvider } from '@mantine/core';

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
import { fetchRatingAndComments } from './functions/dbFunctions';

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
          }
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
          path: '/show-details/:mode/:title/:id',
          element: <MovieDetails />,
          loader: async ({params}) => {
            const { mode, id } = params;
            const cast = await fetchCast(mode, id);
            const trailer = await fetchTrailer(mode, id);
            // const { reviews, dbRating, dbRatingCount, dbRatingTotal } = await fetchRatingAndComments(id);
            // return { cast, trailer, reviews, dbRating, dbRatingCount, dbRatingTotal };
            return { cast, trailer };
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
      <MantineProvider withGlobalStyles withNormalizeCSS>
        <RouterProvider router={router} />
      </MantineProvider>
    </div>
  );
  
};

export default App;
