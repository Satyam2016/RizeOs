import { BrowserRouter, Routes, Route } from "react-router-dom";
import ProtectedRoute from "./ProtectedRoute";
import { Layout } from "./components/layout/Layout";

import Auth from "./pages/Auth";
import Feed from "./pages/Feed";
import Jobs from "./pages/Jobs";
import NotFound from "./pages/NotFound";

const App = () => (
  <BrowserRouter>
    <Routes>
      {/* Public Route */}
      <Route path="/auth" element={<Auth />} />

      {/* All Protected Routes under this */}
      <Route element={<ProtectedRoute />}>
        <Route element={<Layout />}>
          <Route path="/" element={<Feed />} />
          <Route path="/jobs" element={<Jobs />} />
          <Route path="*" element={<NotFound />} />
        </Route>
      </Route>
    </Routes>
  </BrowserRouter>
);

export default App;
