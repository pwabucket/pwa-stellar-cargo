import axios from "axios";

/**
 * An asset object that has been returned by our query to Stellar.Expert
 * @typedef {Object} RankedAsset
 * @property {string} asset Asset identifier
 * @property {number} traded_amount Total traded amount (in stroops)
 * @property {number} payments_amount Total payments amount (in stroops)
 * @property {number} created Timestamp of the first recorder operation with asset
 * @property {number} supply Total issued asset supply
 * @property {Object} trustlines Trustlines established to an asset
 * @property {number} trades Total number of trades
 * @property {number} payments Total number of payments
 * @property {string} domain Associated `home_domain`
 * @property {Object} tomlInfo Asset information from stellar.toml file
 * @property {Object} rating Composite asset rating
 * @property {number} paging_token Paging token
 * @see {@link https://stellar.expert/openapi.html#tag/Asset-Info-API/operation/getAllAssets}
 */

/**
 * Fetches and returns the most highly rated assets, according to the Stellar.Expert calculations.
 * @async
 * @function fetchAssets
 * @returns {Promise<RankedAsset[]>} Array of objects containing details for each asset
 */

const api = axios.create({
  baseURL: import.meta.env.VITE_APP_STELLAR_EXPERT_BASE_URL,
});

export async function fetchAssetMeta(asset) {
  const res = await api.get("/asset/meta", {
    params: {
      asset,
      sort: "rating",
      order: "desc",
      limit: "20",
      cursor: "0",
    },
  });
  const json = res.data;
  const records = json._embedded.records;
  return records;
}
