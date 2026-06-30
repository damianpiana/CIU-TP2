import { Navigate, Route, Routes } from "react-router-dom";

import { CreatePost } from "./pages/CreatePost";
import { Layout } from "./components/Layout";
import { HomePage } from "./pages/HomePage";
import { LoginPage } from "./pages/LoginPage";
import { RegisterPage } from "./pages/RegisterPage";
import { MiPerfilPage } from "./pages/MiPerfilPage";
import { PostDetail } from "./pages/PostDetail";
import { ProtectedRoute } from "./routes/ProtectedRoute";

function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<HomePage />} />
        <Route path="/post/:id" element={<PostDetail />} />

        <Route path="/login" element={<LoginPage />} />

        <Route path="/registro" element={<RegisterPage />} />

        <Route element={<ProtectedRoute />}>
          <Route path="/mi-perfil" element={<MiPerfilPage />} />
          <Route path="/crear-post" element={<CreatePost />} />
        </Route>

        <Route path="*" element={<Navigate to="/" replace />} />
      </Route>
    </Routes>
  );
}
export default App;