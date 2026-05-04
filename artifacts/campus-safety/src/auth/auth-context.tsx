import {
  createContext,
  useCallback,
  useContext,
  type ReactNode,
} from "react";
import { useQueryClient } from "@tanstack/react-query";
import {
  useAuthMe,
  getAuthMeQueryKey,
  useLogin,
  useLogout,
  useRegister,
  type AuthUser,
} from "@workspace/api-client-react";

type AuthContextValue = {
  user: AuthUser | null | undefined;
  isAuthLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
};

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const qc = useQueryClient();
  const { data, isPending } = useAuthMe({ query: { retry: false } });
  const user: AuthUser | null | undefined = isPending ? undefined : (data?.user ?? null);

  const registerMut = useRegister({
    mutation: {
      onSuccess: () => void qc.invalidateQueries({ queryKey: getAuthMeQueryKey() }),
    },
  });
  const loginMut = useLogin({
    mutation: {
      onSuccess: () => void qc.invalidateQueries({ queryKey: getAuthMeQueryKey() }),
    },
  });
  const logoutMut = useLogout({
    mutation: {
      onSuccess: () => {
        qc.setQueryData(getAuthMeQueryKey(), null);
        void qc.invalidateQueries();
      },
    },
  });

  const login = useCallback(
    async (email: string, password: string) => {
      await loginMut.mutateAsync({ data: { email, password } });
    },
    [loginMut],
  );

  const register = useCallback(
    async (email: string, password: string) => {
      await registerMut.mutateAsync({ data: { email, password } });
    },
    [registerMut],
  );

  const logout = useCallback(async () => {
    await logoutMut.mutateAsync();
  }, [logoutMut]);

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthLoading: isPending,
        login,
        register,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
