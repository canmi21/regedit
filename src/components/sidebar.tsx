/* src/components/sidebar.tsx */

import { useEffect, useState } from "react";
import type { Instance } from "@/contexts/instance-context";
import { getProjects } from "@/lib/api";
import { TreeNode } from "./tree-node";

interface SidebarProps {
  instance: Instance;
  selectedKey: string | null;
}

export function Sidebar({ instance, selectedKey }: SidebarProps) {
  const [projects, setProjects] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        setError(null);
        const projectList = await getProjects(instance.url);
        setProjects(projectList);
      } catch (e) {
        setError(e instanceof Error ? e.message : "Failed to fetch projects");
        console.error(e);
      }
    };

    fetchProjects();
  }, [instance]);

  return (
    <aside className="w-64 md:w-80 bg-background border-r border-tertiary/20 overflow-y-auto p-2">
      <div className="font-semibold text-text-sub px-2 py-1 text-sm">
        {instance.name}
      </div>
      {error && <div className="text-red-500 p-2">{error}</div>}
      <nav className="mt-2 space-y-1">
        {projects.map((project) => (
          <TreeNode
            key={project}
            instance={instance}
            name={project}
            path={project}
            level={0}
            selectedKey={selectedKey}
          />
        ))}
      </nav>
    </aside>
  );
}
