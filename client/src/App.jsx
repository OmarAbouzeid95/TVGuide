import './App.css';
import Root from './routes/Root';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';

const App = () => {

  const router = createBrowserRouter([
    {
      path: "/",
      element: <Root />,
    },
  ]);

  return (
    <div>
      <RouterProvider router={router} />
    </div>
  );
  
};

export default App;
