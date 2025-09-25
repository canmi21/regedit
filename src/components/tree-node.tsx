/* src/components/tree-node.tsx */

import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import type { Instance } from "@/contexts/instance-context";
import { listPathContents } from "@/lib/api";
import type { ListingResponse } from "@/lib/api";
import {
  ChevronRightIcon,
  ChevronDownIcon,
  FileTextIcon,
  ArchiveIcon,
} from "@radix-ui/react-icons";
import { cn } from "@/lib/utils";

interface TreeNodeProps {
  instance: Instance;
  name: string;
  path: string;
  level: number;
  selectedKey: string | null;
}

export function TreeNode({
  instance,
  name,
  path,
  level,
  selectedKey,
}: TreeNodeProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [children, setChildren] = useState<ListingResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  // Auto-expand parent nodes of the selected key
  useEffect(() => {
    if (selectedKey?.startsWith(path + "/")) {
      setIsOpen(true);
    }
  }, [selectedKey, path]);

  useEffect(() => {
    if (isOpen && !children) {
      const fetchChildren = async () => {
        try {
          // In the tree-node, the instance ID is not part of the path.
          // The API call needs the project name, which is the first part of the path.
          const [project, ...rest] = path.split("/");
          const relativePath = rest.join("/");
          const contents = await listPathContents(
            instance.url,
            project,
            relativePath,
          );
          setChildren(contents);
        } catch (e) {
          setError(e instanceof Error ? e.message : "Failed to load content");
        }
      };
      fetchChildren();
    }
  }, [isOpen, children, instance, path]);

  const handleGroupClick = () => {
    setIsOpen(!isOpen);
  };

  const handleValueClick = (valueName: string) => {
    const newPath = `${path}/${valueName}`;
    navigate(`/instance/${instance.id}/explore/${newPath}`);
  };

  return (
    <div>
      <div
        onClick={handleGroupClick}
        className={cn(
          "flex items-center gap-2 px-2 py-1.5 rounded-md cursor-pointer hover:bg-background-alt",
          { "bg-accent/20": isOpen },
        )}
        style={{ paddingLeft: `${level * 1.25 + 0.5}rem` }}
      >
        {isOpen ? <ChevronDownIcon /> : <ChevronRightIcon />}
        <ArchiveIcon className="text-accent" />
        <span>{name}</span>
      </div>

      {isOpen && (
        <div className="mt-1">
          {error && (
            <div
              className="text-red-500 text-sm"
              style={{ paddingLeft: `${(level + 1) * 1.25 + 0.5}rem` }}
            >
              {error}
            </div>
          )}
          {children?.groups.map((group) => (
            <TreeNode
              key={group}
              instance={instance}
              name={group}
              path={`${path}/${group}`}
              level={level + 1}
              selectedKey={selectedKey}
            />
          ))}
          {children?.values.map((value) => (
            <div
              key={value}
              onClick={() => handleValueClick(value)}
              className={cn(
                "flex items-center gap-2 px-2 py-1.5 rounded-md cursor-pointer hover:bg-background-alt",
                { "bg-accent text-white": selectedKey === `${path}/${value}` },
              )}
              style={{ paddingLeft: `${(level + 1) * 1.25 + 0.5}rem` }}
            >
              <FileTextIcon />
              <span>{value}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
