import axios from "axios";
/* eslint-disable no-undef */
import useGoogleAuthStore from "@/store/useGoogleAuthStore";
import { loadScript } from "@/lib/utils";
import { useCallback } from "react";
import { useEffect } from "react";
import { useMemo } from "react";
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

  /** @type {import("react").Ref<google.accounts.oauth2.CodeClient>} */
  const codeClientRef = useRef(null);
  const token = useGoogleAuthStore((state) => state.token);
  const setToken = useGoogleAuthStore((state) => state.setToken);
  const setBackupFile = useGoogleAuthStore((state) => state.setBackupFile);

  const isValidToken = Boolean(token && token["expires_at"] > Date.now());
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
    codeClientRef.current = google.accounts.oauth2.initCodeClient({
      client_id: import.meta.env.VITE_GOOGLE_CLIENT_ID,
      scope: SCOPES,
      ux_mode: "popup",
      callback: "",
    });
    setGisInitialized(true);
  }, []);

  const parseToken = useCallback(
    (token) => ({
      ...token,
      ["expires_at"]: Date.now() + token["expires_in"] * 1000,
    }),
    []
  );

  /** Request Access Token */
  const requestAccessToken = useCallback(() => {
    return new Promise((resolve, reject) => {
      codeClientRef.current.callback = async (response) => {
        try {
          const data = await axios
            .post("https://oauth2.googleapis.com/token", {
              code: response.code,
              client_id: import.meta.env.VITE_GOOGLE_CLIENT_ID,
              client_secret: import.meta.env.VITE_GOOGLE_CLIENT_SECRET,
              redirect_uri: new URL(location.href).origin,
              grant_type: "authorization_code",
            })
            .then((res) => res.data);

          resolve(parseToken(data));
        } catch (e) {
          reject(e);
        }
      };

      codeClientRef.current.requestCode();
    });
  }, [parseToken]);

  /** Refetch Token */
  const refetchToken = useCallback(async () => {
    const data = await axios
      .post("https://oauth2.googleapis.com/token", {
        grant_type: "refresh_token",
        refresh_token: token["refresh_token"],
        client_id: import.meta.env.VITE_GOOGLE_CLIENT_ID,
        client_secret: import.meta.env.VITE_GOOGLE_CLIENT_SECRET,
      })
      .then((res) => res.data);

    /** Get New Token */
    const newToken = parseToken({
      ...token,
      ...data,
    });

    /** Set New Token */
    setToken(newToken);

    /** Return New Token */
    return newToken;
  }, [token, setToken, parseToken]);

  /** Get Valid Token */
  const getValidToken = useCallback(async () => {
    if (token && isValidToken) {
      return token["access_token"];
    }

    return refetchToken();
  }, [token, isValidToken, refetchToken]);

  /** Logout */
  const logout = useCallback(async () => {
    if (token) {
      axios.post(
        `https://oauth2.googleapis.com/revoke?token=${token["access_token"]}`
      );
    }
    gapi?.client?.setToken(null);
    setToken(null);
    setBackupFile(null);
  }, [token, setToken, setBackupFile]);

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
      /** Refetch Interval */
      let interval;

      /** Refetch if Expiring */
      const refetchIfExpiring = () => {
        if (token["expires_at"] < Date.now() - 5 * 60 * 1000) {
          refetchToken();
        }
      };

      if (token["expires_at"] < Date.now()) {
        refetchToken();
      } else {
        /** Set GAPI Token */
        gapi.client.setToken(token);

        /** Periodically Refetch Token */
        interval = setInterval(refetchIfExpiring, 60_000);
      }

      return () => {
        clearInterval(interval);
      };
    }
  }, [initialized, token, refetchToken]);

  return useMemo(
    () => ({
      refetchToken,
      getValidToken,
      requestAccessToken,
      logout,
      initialized,
      authorized,
    }),
    [
      refetchToken,
      getValidToken,
      requestAccessToken,
      logout,
      initialized,
      authorized,
    ]
  );
}
