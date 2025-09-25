/* src/components/instance-manager.tsx */

import { useState } from "react";
import { Link } from "react-router-dom";
import { useInstances } from "@/contexts/instance-context";
import type { Instance } from "@/contexts/instance-context";
import * as Dialog from "@radix-ui/react-dialog";
import {
  Cross2Icon,
  PlusIcon,
  Pencil2Icon,
  TrashIcon,
} from "@radix-ui/react-icons";

export function InstanceManager() {
  const { instances, addInstance, updateInstance, deleteInstance } =
    useInstances();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [currentInstance, setCurrentInstance] =
    useState<Partial<Instance> | null>(null);
  const [name, setName] = useState("");
  const [url, setUrl] = useState("");

  const openDialog = (instance: Partial<Instance> | null = null) => {
    setCurrentInstance(instance);
    setName(instance?.name || "");
    setUrl(instance?.url || "");
    setIsDialogOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (currentInstance?.id) {
      updateInstance({ id: currentInstance.id, name, url });
    } else {
      addInstance({ name, url });
    }
    setIsDialogOpen(false);
  };

  return (
    <div className="bg-background border border-tertiary/20 rounded-lg p-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold text-primary">Instances</h2>
        <button
          onClick={() => openDialog()}
          className="flex items-center gap-2 bg-accent text-white px-3 py-2 rounded-md text-sm hover:opacity-90 transition-opacity"
        >
          <PlusIcon /> Add Instance
        </button>
      </div>
      <div className="space-y-3">
        {instances.length > 0 ? (
          instances.map((instance) => (
            <div
              key={instance.id}
              className="flex items-center justify-between bg-background-alt p-3 rounded-md"
            >
              <div>
                <Link
                  to={`/instance/${instance.id}/explore/`}
                  className="font-medium text-primary hover:underline"
                >
                  {instance.name}
                </Link>
                <p className="text-sm text-text-sub">{instance.url}</p>
              </div>
              <div className="flex items-center gap-3">
                <button
                  onClick={() => openDialog(instance)}
                  className="text-text-sub hover:text-primary"
                >
                  <Pencil2Icon />
                </button>
                <button
                  onClick={() => deleteInstance(instance.id)}
                  className="text-text-sub hover:text-red-500"
                >
                  <TrashIcon />
                </button>
              </div>
            </div>
          ))
        ) : (
          <p className="text-center text-text-sub py-4">
            No instances configured. Add one to get started.
          </p>
        )}
      </div>

      <Dialog.Root open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <Dialog.Portal>
          <Dialog.Overlay className="bg-black/50 fixed inset-0" />
          <Dialog.Content className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[90vw] max-w-md bg-background p-6 rounded-lg shadow-lg">
            <Dialog.Title className="text-lg font-medium text-primary">
              {currentInstance?.id ? "Edit" : "Add"} Instance
            </Dialog.Title>
            <form onSubmit={handleSubmit} className="mt-4 space-y-4">
              <div>
                <label
                  htmlFor="name"
                  className="block text-sm font-medium text-text-sub"
                >
                  Name
                </label>
                <input
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  className="mt-1 block w-full bg-background-alt border border-tertiary/20 rounded-md px-3 py-2"
                />
              </div>
              <div>
                <label
                  htmlFor="url"
                  className="block text-sm font-medium text-text-sub"
                >
                  URL
                </label>
                <input
                  id="url"
                  type="url"
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  required
                  placeholder="http://localhost:19950"
                  className="mt-1 block w-full bg-background-alt border border-tertiary/20 rounded-md px-3 py-2"
                />
              </div>
              <div className="flex justify-end gap-4 mt-6">
                <Dialog.Close asChild>
                  <button
                    type="button"
                    className="px-4 py-2 rounded-md bg-tertiary/20 text-text-sub hover:bg-tertiary/30"
                  >
                    Cancel
                  </button>
                </Dialog.Close>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-md bg-accent text-white hover:opacity-90"
                >
                  {currentInstance?.id ? "Save Changes" : "Add Instance"}
                </button>
              </div>
            </form>
            <Dialog.Close asChild>
              <button className="absolute top-4 right-4 text-text-sub hover:text-primary">
                <Cross2Icon />
              </button>
            </Dialog.Close>
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>
    </div>
  );
}
