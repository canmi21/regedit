/* src/contexts/instance-context.tsx */

import { createContext, useContext, useState } from "react";
import type { ReactNode } from "react";

export interface Instance {
  id: string;
  name: string;
  url: string;
}

interface InstanceContextType {
  instances: Instance[];
  addInstance: (instance: Omit<Instance, "id">) => void;
  updateInstance: (instance: Instance) => void;
  deleteInstance: (id: string) => void;
}

const InstanceContext = createContext<InstanceContextType | undefined>(
  undefined,
);

export function InstanceProvider({ children }: { children: ReactNode }) {
  const [instances, setInstances] = useState<Instance[]>([]);

  const addInstance = (instance: Omit<Instance, "id">) => {
    setInstances((prev) => [...prev, { id: crypto.randomUUID(), ...instance }]);
  };

  const updateInstance = (updated: Instance) => {
    setInstances((prev) =>
      prev.map((i) => (i.id === updated.id ? updated : i)),
    );
  };

  const deleteInstance = (id: string) => {
    setInstances((prev) => prev.filter((i) => i.id !== id));
  };

  return (
    <InstanceContext.Provider
      value={{ instances, addInstance, updateInstance, deleteInstance }}
    >
      {children}
    </InstanceContext.Provider>
  );
}

export function useInstances() {
  const ctx = useContext(InstanceContext);
  if (!ctx)
    throw new Error("useInstances must be used within InstanceProvider");
  return ctx;
}
