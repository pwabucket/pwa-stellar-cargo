import Home from "@/pages/Home";
import { Route, Routes } from "react-router";

import About from "./pages/About";
import Account from "./pages/Account";
import AccountOverviewRoute from "./routes/AccountOverviewRoute";
import AccountRoute from "./routes/AccountRoute";
import Asset from "./pages/Asset";
import AssetRoute from "./routes/AssetRoute";
import BatchExport from "./pages/BatchExport";
import BatchImport from "./pages/BatchImport";
import ContactDetails from "./partials/ContactDetails";
import Contacts from "./pages/Contacts";
import CreateContact from "./pages/CreateContact";
import Dashboard from "./pages/Dashboard";
import EditAccount from "./pages/EditAccount";
import EditContact from "./pages/EditContact";
import GuestRoute from "./routes/GuestRoute";
import ImportWallet from "./pages/ImportWallet";
import Menu from "./pages/Menu";
import Merge from "./pages/Merge";
import ProtectedRoute from "./routes/ProtectedRoute";
import Send from "./pages/Send";
import Split from "./pages/Split";
import Swap from "./pages/Swap";
import Transactions from "./pages/Transactions";
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

      {/* About */}
      <Route path="about" element={<About />} />

      {/* Batch Import */}
      <Route path="batch-import" element={<BatchImport />} />

      {/* Protected Routes */}
      <Route element={<ProtectedRoute />}>
        <Route path="app" element={<Dashboard />} />

        {/* Contacts */}
        <Route path="contacts/:id/edit" element={<EditContact />} />
        <Route path="contacts/:id" element={<ContactDetails />} />
        <Route path="contacts/create" element={<CreateContact />} />
        <Route path="contacts" element={<Contacts />} />

        {/* Account */}
        <Route path="accounts/:publicKey/edit" element={<EditAccount />} />
        <Route path="accounts/:publicKey" element={<AccountRoute />}>
          <Route element={<AccountOverviewRoute />}>
            <Route index element={<Account />} />
            <Route path="transactions" element={<Transactions />} />
          </Route>

          {/* Asset */}
          <Route path="assets/:asset" element={<AssetRoute />}>
            <Route index element={<Asset />} />
            <Route path="merge" element={<Merge />} />
            <Route path="split" element={<Split />} />
            <Route path="swap" element={<Swap />} />
            <Route path="send" element={<Send />} />
          </Route>
        </Route>

        {/* Import Wallet */}
        <Route path="import" element={<ImportWallet />} />

        {/* Batch Export */}
        <Route path="batch-export" element={<BatchExport />} />

        {/* Menu */}
        <Route path="menu" element={<Menu />} />
      </Route>
    </Routes>
  );
}

export default App;
