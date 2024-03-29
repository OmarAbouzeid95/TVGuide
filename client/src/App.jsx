import "./App.css";
// material-ui fonts
import "@fontsource/roboto/300.css";
import "@fontsource/roboto/400.css";
import "@fontsource/roboto/500.css";
import "@fontsource/roboto/700.css";

// components
import Root from "./routes/Root";
import SignIn from "./components/SignIn";
import SignUp from "./components/SignUp";
import MovieDetails from "./components/MovieDetails";
import AccountDetails from "./components/AccountDetails";
import PrivacyPolicy from "./components/PrivacyPolicy";
import UserReviews from "./components/UserReviews";

// routes
import ErrorPage from "./routes/ErrorPage";
import TrendingPage from "./routes/TrendingPage";
import PopularPage from "./routes/PopularPage";
import SearchPage from "./routes/SearchPage";
import TopRatedPage from "./routes/TopRatedPage";
import UpcomingPage from "./routes/UpcomingPage";
import HomePage from "./routes/HomePage";
import WatchlistPage from "./routes/WatchlistPage";
import ProfilePage from "./routes/ProfilePage";
import { createBrowserRouter, RouterProvider } from "react-router-dom";

// functions
import { searchMovies } from "./functions/movieFunctions";
import {
  fetchCast,
  fetchTrailer,
  fetchDetails,
} from "./functions/movieFunctions";

const App = () => {
  const router = createBrowserRouter([
    {
      path: "/",
      element: <Root />,
      children: [
        {
          path: "",
          element: <HomePage />,
        },
        {
          path: "signIn",
          element: <SignIn />,
        },
        {
          path: "signUp",
          element: <SignUp />,
        },
        {
          path: "/search/:mode/:keyword",
          element: <SearchPage />,
          loader: async ({ params }) => {
            const { mode, keyword } = params;
            return searchMovies(mode, keyword);
          },
          // handle: {
          //   crumbName: 'Search'
          // }
        },
        {
          path: "/trending",
          element: <TrendingPage />,
        },
        {
          path: "/popular/:mode",
          element: <PopularPage />,
        },
        {
          path: "/top-rated/:mode",
          element: <TopRatedPage />,
        },
        {
          path: "/upcoming/:mode",
          element: <UpcomingPage />,
        },
        {
          path: "/watchlist",
          element: <WatchlistPage />,
        },
        {
          path: "/show-details/:mode/:id",
          element: <MovieDetails />,
          loader: async ({ params }) => {
            const { mode, id } = params;
            const cast = await fetchCast(mode, id);
            const trailer = await fetchTrailer(mode, id);
            const {
              genres,
              poster_path,
              release_date,
              title,
              overview,
              vote_average,
              name,
            } = await fetchDetails(mode, id);
            return {
              cast,
              trailer,
              id,
              genres,
              poster_path,
              release_date,
              title,
              overview,
              vote_average,
              name,
            };
          },
        },
        {
          path: "/profile",
          element: <ProfilePage />,
          children: [
            {
              path: "/profile/account-details",
              element: <AccountDetails />,
            },
            {
              path: "/profile/privacy",
              element: <PrivacyPolicy />,
            },
            {
              path: "/profile/user-reviews",
              element: <UserReviews />,
            },
          ],
        },
        {
          path: "*",
          element: <ErrorPage />,
        },
      ],
    },
  ]);

  return (
    <div>
      <RouterProvider router={router} />
    </div>
  );
};

export default App;
