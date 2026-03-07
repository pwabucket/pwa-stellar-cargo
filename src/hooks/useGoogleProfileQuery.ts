import axios from "axios";
import useAppContext from "./useAppContext";
import useIsLoggedIn from "./useIsLoggedIn";
import { useQuery } from "@tanstack/react-query";

export default function useGoogleProfileQuery() {
  const { googleApi } = useAppContext();
  const { authorized } = googleApi;
  const isLoggedIn = useIsLoggedIn();

  return useQuery({
    enabled: isLoggedIn && authorized,
    queryKey: ["google-drive", "user-profile", authorized],
    queryFn: () =>
      axios
        .get(`https://www.googleapis.com/oauth2/v2/userinfo`, {
          headers: {
            Authorization: `Bearer ${gapi.client.getToken()["access_token"]}`,
          },
        })
        .then((res) => res.data),
  });
}
