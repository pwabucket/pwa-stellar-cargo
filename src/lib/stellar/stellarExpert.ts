import type { AssetMeta } from "@/types/index.d.ts";
import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_APP_STELLAR_EXPERT_BASE_URL,
});

export async function fetchAssetMeta(
  asset: string | string[],
): Promise<AssetMeta[]> {
  const res = await api.get("/asset/meta", {
    params: {
      asset,
      sort: "rating",
      order: "desc",
      limit: "100",
      cursor: "0",
    },
  });
  const json = res.data;
  const records = json._embedded.records;
  return records;
}
