import type { BackupContent, BackupFile } from "@/types/index.d.ts";

import axios from "axios";

export const BACKUP_FILENAME = "backup.json";

/** Find Backup File */
export const findBackupFile = async (): Promise<BackupFile | null> => {
  const res = await gapi.client.drive.files.list({
    spaces: "appDataFolder",
    q: `name = '${BACKUP_FILENAME}' and trashed = false`,
    fields: "files(id, name, modifiedTime)",
  });

  return (res.result.files?.[0] as BackupFile | undefined) || null;
};

/** Fetch Backup Content */
export const fetchBackupContent = async (
  fileId: string,
  options?: Record<string, unknown>,
): Promise<BackupContent> => {
  return axios
    .get(`https://www.googleapis.com/drive/v3/files/${fileId}?alt=media`, {
      ...options,
      headers: {
        Authorization: `Bearer ${gapi.client.getToken()["access_token"]}`,
      },
    })
    .then((res) => res.data);
};

/** Upload Backup */
export const uploadBackup = async (
  content: BackupContent,
): Promise<BackupFile> => {
  const file = await findBackupFile();
  const fileContent = JSON.stringify(content);

  const form = new FormData();
  const metadata = {
    name: BACKUP_FILENAME,
    parents: file === null ? ["appDataFolder"] : undefined,
  };

  form.append(
    "metadata",
    new Blob([JSON.stringify(metadata)], { type: "application/json" }),
  );

  form.append("file", new Blob([fileContent], { type: "application/json" }));

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
        Authorization: `Bearer ${gapi.client.getToken()["access_token"]}`,
      },
      data: form,
    })
    .then((res) => res.data);
};
