/* src/contexts/instance-definitions.ts */

 * @file instance-definitions.ts
 * @brief Instance types and InstanceContext definition
 * @author Canmi
 */

import { createContext } from "react";

export interface Instance {
  id: string;
  name: string;
  url: string;
}

export interface InstanceContextType {
  instances: Instance[];
  addInstance: (instance: Omit<Instance, "id">) => void;
  updateInstance: (instance: Instance) => void;
  deleteInstance: (id: string) => void;
  getInstanceById: (id: string) => Instance | undefined;
}

export const InstanceContext = createContext<InstanceContextType | undefined>(
  undefined,
);
