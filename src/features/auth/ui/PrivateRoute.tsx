import { ROUTES } from "@/shared/lib/constants";
import { useAppSelector } from "@/store/hooks";
import { Navigate, Outlet, useLocation } from "react-router-dom";


type PrivateRouteProps = {
    onlyUnAuth?: boolean;
};

export const PrivateRoute = ({
onlyUnAuth = false,
}: PrivateRouteProps) => {
  const isAuthenticated = useAppSelector((state) => state.auth.isAuthenticated) //перенаправление пока не работает корректно в силу отсутсвия стора, потом должно заработать 

  const location = useLocation();


  if (!onlyUnAuth && !isAuthenticated) {
    return <Navigate replace to={ROUTES.LOGIN} state={{ from: location }} />;
  }

  if (onlyUnAuth && isAuthenticated) {
    const from = location.state?.from?.pathname || ROUTES.HOME ;
    return <Navigate replace to={from} />;
  }

  return <Outlet />;

}