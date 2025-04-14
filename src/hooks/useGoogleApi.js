/* eslint-disable no-undef */
import useGoogleAuthStore from "@/store/useGoogleAuthStore";
import { loadScript } from "@/lib/utils";
import { useCallback } from "react";
import { useEffect } from "react";
import { useRef } from "react";
import { useState } from "react";

const DISCOVERY_DOCS = [
  "https://www.googleapis.com/discovery/v1/apis/drive/v3/rest",
];

const SCOPES = ["https://www.googleapis.com/auth/drive.appdata"].join(" ");

export default function useGoogleApi() {
  const [gapiInitialized, setGapiInitialized] = useState(false);
  const [gisInitialized, setGisInitialized] = useState(false);
  const loadingRef = useRef(false);

  /** @type {import("react").Ref<google.accounts.oauth2.TokenClient>} */
  const tokenClientRef = useRef(null);
  const token = useGoogleAuthStore((state) => state.token);
  const expiresAt = useGoogleAuthStore((state) => state.expiresAt);
  const setToken = useGoogleAuthStore((state) => state.setToken);

  const isValidToken = Boolean(token && expiresAt && expiresAt > Date.now());
  const initialized = gapiInitialized && gisInitialized;
  const authorized = initialized && isValidToken;

  /** Callback to Initialize Gapi */
  const initializeGapi = useCallback(() => {
    gapi.load("client", async () => {
      await gapi.client.init({
        apiKey: import.meta.env.VITE_GOOGLE_API_KEY,
        discoveryDocs: DISCOVERY_DOCS,
      });
      setGapiInitialized(true);
    });
  }, []);

  /** Callback to Initialize Gis */
  const initializeGis = useCallback(() => {
    tokenClientRef.current = google.accounts.oauth2.initTokenClient({
      client_id: import.meta.env.VITE_GOOGLE_CLIENT_ID,
      scope: SCOPES,
      callback: "", // defined later
    });
    setGisInitialized(true);
  }, []);

  /** Handle Auth */
  const handleAuth = useCallback(() => {
    return new Promise((resolve, reject) => {
      if (token && isValidToken) return resolve(token);

      tokenClientRef.current.callback = (resp) => {
        if (resp.error) return reject(resp);
        const newToken = gapi.client.getToken();
        setToken(newToken);
        resolve(newToken);
      };

      tokenClientRef.current.requestAccessToken({
        prompt: token ? "" : "consent",
      });
    });
  }, [token, isValidToken, setToken]);

  /** Refetch Token */
  const refetchToken = useCallback(
    () =>
      new Promise((resolve, reject) => {
        tokenClientRef.current.callback = (resp) => {
          if (resp.error) return reject(resp);
          const newToken = gapi.client.getToken();
          setToken(newToken);
          resolve(newToken["access_token"]);
        };

        tokenClientRef.current.requestAccessToken({ prompt: "" });
      }),
    [setToken]
  );

  /** Get Valid Token */
  const getValidToken = useCallback(async () => {
    if (token && isValidToken) {
      return token["access_token"];
    }

    return refetchToken();
  }, [token, isValidToken, refetchToken]);

  /** Logout */
  const logout = useCallback(() => {
    gapi.client.setToken(null);
    setToken(null);
  }, [setToken]);

  /** Initialize Google Scripts */
  useEffect(() => {
    if (loadingRef.current === false) {
      loadingRef.current = true;
      loadScript("https://apis.google.com/js/api.js").then(initializeGapi);
      loadScript("https://accounts.google.com/gsi/client").then(initializeGis);
    }
  }, [initializeGapi, initializeGis]);

  /** Restore Token */
  useEffect(() => {
    if (initialized && token) {
      if (expiresAt < Date.now()) {
        refetchToken();
      } else {
        gapi.client.setToken(token);
      }
    }
  }, [initialized, token, expiresAt, refetchToken]);

  return {
    handleAuth,
    refetchToken,
    getValidToken,
    logout,
    initialized,
    authorized,
  };
}
