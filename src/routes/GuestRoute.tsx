import ProtectedRoute from "./ProtectedRoute";

export default function GuestRoute() {
  return <ProtectedRoute status={false} to="/app" />;
}
