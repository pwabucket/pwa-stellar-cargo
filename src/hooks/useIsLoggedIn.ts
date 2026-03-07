import useAppStore from "@/store/useAppStore";

export default function useIsLoggedIn() {
  const isLoggedIn = useAppStore((state) => state.isLoggedIn);
  return isLoggedIn;
}
