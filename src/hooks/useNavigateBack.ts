import { useLocation, useNavigate } from "react-router";

import { useCallback } from "react";

const useNavigateBack = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const navigateBack = useCallback(() => {
    return location.key !== "default" ? navigate(-1) : navigate("/");
  }, [location, navigate]);

  return navigateBack;
};

export default useNavigateBack;
