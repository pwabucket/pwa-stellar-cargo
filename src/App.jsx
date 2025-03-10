import Home from "@/pages/Home";
import { Route, Routes } from "react-router";

import About from "./pages/About";
import Account from "./pages/Account";
import AccountRoute from "./routes/AccountRoute";
import Asset from "./pages/Asset";
import AssetRoute from "./routes/AssetRoute";
import BatchExport from "./pages/BatchExport";
import BatchImport from "./pages/BatchImport";
import Dashboard from "./pages/Dashboard";
import EditAccount from "./pages/EditAccount";
import GuestRoute from "./routes/GuestRoute";
import ImportWallet from "./pages/ImportWallet";
import Menu from "./pages/Menu";
import Merge from "./pages/Merge";
import ProtectedRoute from "./routes/ProtectedRoute";
import useAppStore from "./store/useAppStore";
import useInactivity from "./hooks/useInactivity";
import useTheme from "./hooks/useTheme";

const INACTIVITY_DURATION = 3 * 60 * 1000;

function App() {
  const theme = useAppStore((state) => state.theme);
  useTheme(theme);

  useInactivity(INACTIVITY_DURATION);

  return (
    <Routes>
      <Route element={<GuestRoute />}>
        <Route index element={<Home />} />
      </Route>

      <Route path="about" element={<About />} />
      <Route path="batch-import" element={<BatchImport />} />
      <Route element={<ProtectedRoute />}>
        <Route path="app" element={<Dashboard />} />
        <Route path="menu" element={<Menu />} />
        <Route path="import" element={<ImportWallet />} />
        <Route path="batch-export" element={<BatchExport />} />
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
