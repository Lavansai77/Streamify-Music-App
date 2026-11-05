import { attachAuthInterceptor } from "@/lib/axios";
import { useAuthStore } from "@/stores/useAuthStore";
import { useChatStore } from "@/stores/useChatStore";
import { useAuth } from "@clerk/clerk-react";
import { Loader } from "lucide-react";
import { useEffect, useRef, useState } from "react";

const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const { getToken, userId } = useAuth();

  const [loading, setLoading] = useState(true);

  const { checkAdminStatus } = useAuthStore();
  const { initSocket, disconnectSocket } = useChatStore();

  /**
   * Keep the latest getToken function without recreating
   * the Axios interceptor whenever Clerk updates its function reference.
   */
  const getTokenRef = useRef(getToken);

  useEffect(() => {
    getTokenRef.current = getToken;
  }, [getToken]);

  /**
   * Attach Axios authentication interceptor once.
   *
   * Every API request will ask Clerk for a fresh token instead
   * of using an old token stored in Axios defaults.
   */
  useEffect(() => {
    const detachAuthInterceptor = attachAuthInterceptor(() =>
      getTokenRef.current()
    );

    return () => {
      detachAuthInterceptor();
    };
  }, []);

  /**
   * Initialize authentication-dependent application state.
   */
  useEffect(() => {
    let cancelled = false;

    const initAuth = async () => {
      try {
        const token = await getTokenRef.current();

        if (token) {
          await checkAdminStatus();

          if (!cancelled && userId) {
            initSocket(userId);
          }
        }
      } catch (error) {
        console.error("Error in auth provider:", error);
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    initAuth();

    return () => {
      cancelled = true;
      disconnectSocket();
    };
  }, [userId, checkAdminStatus, initSocket, disconnectSocket]);

  if (loading) {
    return (
      <div className="h-screen w-full flex items-center justify-center">
        <Loader className="size-8 text-emerald-500 animate-spin" />
      </div>
    );
  }

  return <>{children}</>;
};

export default AuthProvider;