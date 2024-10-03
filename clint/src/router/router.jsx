import { createBrowserRouter } from "react-router-dom";
import Main from "../Main";
import Home from "../component/page/home/Home";
import About from "../component/page/about/About";
import Contact from "../component/page/contact/Contact";
import BuyTicket from "../component/page/buyticket/BuyTicket";
import MovieDetails from "../component/page/moviedetails/MovieDetails";
import Search from "../component/page/serch/Search";
import ViewAllMovie from "../component/page/viewallmovie/ViewAllMovie";
import Login from "../component/page/login/Login";
import Signup from "../component/page/signup/Signup";
import Profile from "../component/page/profile/Profile"; // Profile layout
import PrivetRoute from "./PrivetRouter";
import AddAdmin from "../component/page/profile/AddAdmin";
import UserBooking from "../component/page/profile/UserBooking";
import Favourites from "../component/page/profile/Favourites";
import AddMovie from "../component/page/profile/AddMovie";
import ViewAllMovies from "../component/page/profile/ViewAllMovies";
import UpdateMovie from "../component/page/profile/UpdateMovie";
import AddShowTime from "../component/page/profile/AddShowTime";

// Function to create the app router
export function createAppRouter(role) {
  const routes = [
    { path: "/", element: <Home /> },
    { path: "/about", element: <About /> },
    { path: "/contact", element: <Contact /> },
    { path: "/ticket/:id", element: <PrivetRoute><BuyTicket /></PrivetRoute> },
    { path: "/detail/:id", element: <MovieDetails /> },
    { path: "/search-movie", element: <Search /> },
    { path: "/viewallmovie", element: <ViewAllMovie /> },
    { path: "/login", element: <Login /> },
    { path: "/signup", element: <Signup /> },
    {
      path: "/profile",
      element: <PrivetRoute><Profile /></PrivetRoute>, // Profile layout for authenticated users
      children: [
        { path: "/profile", element: role === 'user' ? <Favourites /> : <AddAdmin /> },
        { path: "/profile/orderHistory", element: <UserBooking /> },
        { path: "/profile/addbook", element: role === 'admin' ? <AddMovie /> : <Favourites /> },
        { path: "/profile/add-admin", element: role === 'admin' ? <AddAdmin /> : <Favourites /> },
        { path: "/profile/settings", element: <div>Settings Component</div> }, // Placeholder for Settings component
        { path: "/profile/allmovie", element: role === 'admin'&&<ViewAllMovies/> },
        { path: "/profile/update/:id", element: role === 'admin'&&<UpdateMovie/> },
        { path: "/profile/showtime", element: role === 'admin'&&<AddShowTime/> }
      ]
    }
  ];

  return createBrowserRouter([
    {
      path: "/",
      element: <Main />,
      children: routes,
    },
  ]);
}
