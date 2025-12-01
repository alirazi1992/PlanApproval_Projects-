import { useMemo } from "react";
import { useAuth } from "../features/auth/AuthContext";
import { Role, Scope, User } from "../types";

const roleMap: Record<string, Role> = {
  admin: "UnitManager",
  technician: "TechnicalExpert",
  client: "ClientOwner",
};

const defaultScope: Scope = {
  organizationId: "org-1",
  departmentId: "dep-1",
  unitId: "unit-1",
};

export function useCurrentUser(): User | null {
  const { user } = useAuth();

  return useMemo(() => {
    if (!user) return null;
    const mappedRole = roleMap[user.role] ?? "ClientOwner";
    const scope: Scope = {
      ...defaultScope,
      clientId: mappedRole.startsWith("Client") ? `client-${user.email}` : undefined,
      projectIds: undefined,
    };
    return {
      id: user.email,
      name: user.name,
      email: user.email,
      avatar: user.avatar,
      role: mappedRole,
      scopes: scope,
    };
  }, [user]);
}
