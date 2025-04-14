/* eslint-disable no-undef */
import InnerAppLayout from "@/layouts/InnerAppLayout";
import useAppContext from "@/hooks/useAppContext";

export default function GoogleDrive() {
  const { googleApi } = useAppContext();

  return (
    <InnerAppLayout className="gap-4" headerTitle="Google Drive">
      {googleApi.authorized ? (
        <button onClick={() => googleApi.logout()}>Disconnect</button>
      ) : googleApi.initialized ? (
        <button onClick={() => googleApi.handleAuth()}>Authorize</button>
      ) : null}
    </InnerAppLayout>
  );
}
