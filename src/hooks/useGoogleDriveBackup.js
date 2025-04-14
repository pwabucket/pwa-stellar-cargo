import axios from "axios";
/* eslint-disable no-undef */
import useAppStore from "@/store/useAppStore";
import useGoogleAuthStore from "@/store/useGoogleAuthStore";
import {
  exportRawKeys,
  importRawKeys,
  removeAllKeys,
} from "@/lib/stellar/keyManager";
import { useCallback } from "react";
import { useEffect } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

const BACKUP_FILENAME = "backup.json";

export default function useGoogleDriveBackup(googleApi) {
  const { authorized, getValidToken } = googleApi;

  const accounts = useAppStore((state) => state.accounts);
  const contacts = useAppStore((state) => state.contacts);
  const setAccounts = useAppStore((state) => state.setAccounts);
  const setContacts = useAppStore((state) => state.setContacts);
  const backupFile = useGoogleAuthStore((state) => state.backupFile);
  const setBackupFile = useGoogleAuthStore((state) => state.setBackupFile);

  const { setQueryData } = useQueryClient();
  const query = useQuery({
    enabled: authorized,
    queryKey: ["google-drive", "backup-file"],
    queryFn: () => findBackupFile(),
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    refetchInterval: 30_000,
  });

  const { mutateAsync } = useMutation({
    mutationKey: ["google-drive", "backup-to-drive"],
    mutationFn: () => backupToDrive(),
  });

  const fetchBackupContent = useCallback(
    async (fileId, options) => {
      return axios
        .get(`https://www.googleapis.com/drive/v3/files/${fileId}?alt=media`, {
          ...options,
          headers: {
            Authorization: `Bearer ${await getValidToken()}`,
          },
        })
        .then((res) => res.data);
    },
    [getValidToken]
  );

  const findBackupFile = useCallback(async () => {
    const res = await gapi.client.drive.files.list({
      spaces: "appDataFolder",
      q: `name = '${BACKUP_FILENAME}' and trashed = false`,
      fields: "files(id, name, modifiedTime)",
    });

    return res.result.files?.[0] || null;
  }, []);

  const uploadBackup = useCallback(
    async (content) => {
      const file = await findBackupFile();
      const fileContent = JSON.stringify(content);

      const form = new FormData();
      const metadata = {
        name: BACKUP_FILENAME,
        parents: file === null ? ["appDataFolder"] : undefined,
      };

      form.append(
        "metadata",
        new Blob([JSON.stringify(metadata)], { type: "application/json" })
      );

      form.append(
        "file",
        new Blob([fileContent], { type: "application/json" })
      );

      const query = new URLSearchParams({
        uploadType: "multipart",
        fields: "id,name,modifiedTime",
      }).toString();

      const url = file
        ? `https://www.googleapis.com/upload/drive/v3/files/${file.id}?${query}`
        : `https://www.googleapis.com/upload/drive/v3/files?${query}`;

      const method = file ? "PATCH" : "POST";

      return axios
        .request({
          url,
          method,
          headers: {
            Authorization: `Bearer ${await getValidToken()}`,
          },
          data: form,
        })
        .then((res) => res.data);
    },
    [findBackupFile, getValidToken]
  );

  const backupToDrive = useCallback(async () => {
    const keys = await exportRawKeys();
    const content = {
      updatedAt: Date.now(),
      data: {
        keys,
        accounts,
        contacts,
      },
    };

    return uploadBackup(content);
  }, [accounts, contacts, uploadBackup]);

  const importDriveBackup = useCallback(
    async (content) => {
      const { data } = content;

      await removeAllKeys();
      await importRawKeys(data.keys);

      setContacts(data.contacts);
      setAccounts(data.accounts);
    },
    [setContacts, setAccounts]
  );

  useEffect(() => {
    if (query.isSuccess) {
      const remoteBackupFile = query.data;

      if (remoteBackupFile) {
        mutateAsync();
        if (
          remoteBackupFile.id !== backupFile?.id ||
          new Date(remoteBackupFile.modifiedTime).getTime() >
            new Date(backupFile?.modifiedTime).getTime()
        ) {
          fetchBackupContent(remoteBackupFile.id).then(async (content) => {
            await importDriveBackup(content);
            await setBackupFile(remoteBackupFile);
          });
        }
      } else {
        mutateAsync().then((file) => {
          setQueryData(["google-drive", "backup-file"], () => file);
          setBackupFile(file);
        });
      }
    }
  }, [
    query.isSuccess,
    query.data,
    backupFile,
    setBackupFile,
    setQueryData,
    fetchBackupContent,
    mutateAsync,
    importDriveBackup,
  ]);
}
