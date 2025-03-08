import Home from "@/pages/Home";
import { Route, Routes } from "react-router";
import Account from "./pages/Account";
import Dashboard from "./pages/Dashboard";
import EditAccount from "./pages/EditAccount";
import GuestRoute from "./routes/GuestRoute";
import ImportWallet from "./pages/ImportWallet";
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
        <Route path="account/:publicKey" element={<Account />} />
      </Route>
    </Routes>
  );
}

export default App;
