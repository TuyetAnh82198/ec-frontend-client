import { createBrowserRouter, RouterProvider } from "react-router-dom";

import "bootstrap/dist/css/bootstrap.min.css";

import RootLayout from "./components/RootLayout";
import Home from "./pages/Home";
import Page404 from "./pages/Page404";
import Page500 from "./pages/Page500";
import Shop from "./pages/Shop";
import Detail from "./pages/Detail";
import SignUp from "./pages/SignUp";
import Login from "./pages/Login";
import Cart from "./pages/Cart";
import Checkout from "./pages/Checkout";
import PaymentSuccess from "./pages/PaymentSuccess";
import PaymentCancel from "./pages/PaymentCancel";
import History from "./pages/History";
import HistoryDetail from "./pages/HistoryDetail";

function App() {
  const router = createBrowserRouter([
    {
      path: "/",
      element: <RootLayout />,
      children: [
        {
          index: true,
          element: <Home />,
        },
        { path: "/shop", element: <Shop /> },
        { path: "/detail/:id", element: <Detail /> },
        { path: "/cart", element: <Cart /> },
        { path: "/checkout", element: <Checkout /> },
        { path: "/payment-success", element: <PaymentSuccess /> },
        { path: "/payment-cancel", element: <PaymentCancel /> },
        { path: "/history", element: <History /> },
        { path: "/history-detail/:id", element: <HistoryDetail /> },
      ],
    },
    { path: "/sign-up", element: <SignUp /> },
    { path: "/login", element: <Login /> },

    { path: "*", element: <Page404 /> },
    { path: "/server-error", element: <Page500 /> },
  ]);
  return <RouterProvider router={router} />;
}

export default App;
