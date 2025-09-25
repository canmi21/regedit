/* src/client.tsx */

import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { InstanceProvider } from "./contexts/instance-context";
import HomePage from "./pages/home-page";
import EditorPage from "./pages/editor-page";

function App() {
  return (
    <InstanceProvider>
      <Router>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route
            path="/instance/:instanceId/explore/*"
            element={<EditorPage />}
          />
        </Routes>
      </Router>
    </InstanceProvider>
  );
}

export default App;
