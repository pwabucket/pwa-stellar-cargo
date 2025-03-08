import Home from "@/pages/Home";
import { Route, Routes } from "react-router";

import Account from "./pages/Account";
import AccountRoute from "./routes/AccountRoute";
import Asset from "./pages/Asset";
import AssetRoute from "./routes/AssetRoute";
import Dashboard from "./pages/Dashboard";
import EditAccount from "./pages/EditAccount";
import GuestRoute from "./routes/GuestRoute";
import ImportWallet from "./pages/ImportWallet";
import Merge from "./pages/Merge";
import ProtectedRoute from "./routes/ProtectedRoute";

function App() {
  return (
    <Routes>
      <Route element={<GuestRoute />}>
        <Route index element={<Home />} />
      </Route>
      <Route element={<ProtectedRoute />}>
        <Route path="app" element={<Dashboard />} />
        <Route path="import" element={<ImportWallet />} />
        <Route path="account/:publicKey/edit" element={<EditAccount />} />
        <Route path="account/:publicKey" element={<AccountRoute />}>
          <Route index element={<Account />} />
          <Route path="asset/:asset" element={<AssetRoute />}>
            <Route index element={<Asset />} />
            <Route path="merge" element={<Merge />} />
          </Route>
        </Route>
      </Route>
    </Routes>
  );
}

export default App;
