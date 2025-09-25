/* src/contexts/instance-provider.tsx */

/* eslint-disable react-refresh/only-export-components */
import { createContext, useState } from "react";
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
  getInstanceById: (id: string) => Instance | undefined;
}

export const InstanceContext = createContext<InstanceContextType | undefined>(
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

  const getInstanceById = (id: string) => {
    return instances.find((i) => i.id === id);
  };

  return (
    <InstanceContext.Provider
      value={{
        instances,
        addInstance,
        updateInstance,
        deleteInstance,
        getInstanceById,
      }}
    >
      {children}
    </InstanceContext.Provider>
  );
}
