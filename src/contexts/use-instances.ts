/* src/contexts/use-instances.ts */

import { useContext } from "react";
import { InstanceContext } from "./instance-provider";

export function useInstances() {
  const ctx = useContext(InstanceContext);
  if (!ctx)
    throw new Error("useInstances must be used within InstanceProvider");
  return ctx;
}
