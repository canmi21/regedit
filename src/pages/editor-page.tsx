/* src/pages/editor-page.tsx */

import { useParams, useNavigate } from "react-router-dom";
import { useInstances } from "@/contexts/use-instances";
import { Sidebar } from "@/components/sidebar";
import { ValueEditor } from "@/components/value-editor";
import { Layout } from "@/components/layout";
import { useEffect, useState } from "react";

function EditorPage() {
  const { instanceId } = useParams<{ instanceId: string }>();
  const navigate = useNavigate();
  const { getInstanceById } = useInstances();
  const [selectedKey, setSelectedKey] = useState<string | null>(null);

  const instance = instanceId ? getInstanceById(instanceId) : undefined;

  // The '*' in the route gives us the path
  const pathParams = useParams<{ "*": string }>();
  const currentPath = pathParams["*"] || "";

  useEffect(() => {
    if (!instance) {
      // If instance is missing, redirect to home
      console.error("Instance not found");
      navigate("/");
    }
  }, [instance, navigate]);

  useEffect(() => {
    // A path is a key if it doesn't end with a slash.
    if (currentPath && !currentPath.endsWith("/")) {
      setSelectedKey(currentPath);
    } else {
      setSelectedKey(null);
    }
  }, [currentPath]);

  if (!instance) {
    return <div>Loading instance...</div>;
  }

  return (
    <Layout>
      <div className="flex flex-1 overflow-hidden">
        <Sidebar instance={instance} selectedKey={selectedKey} />
        <main className="flex-1 flex flex-col bg-background-alt">
          <ValueEditor instance={instance} selectedKey={selectedKey} />
        </main>
      </div>
    </Layout>
  );
}

export default EditorPage;
