import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import Login from "./pages/Login";
import Register from "./pages/Register";
import CreateRally from "./pages/CreateRally";
import Profile from "./pages/Profile";
import RallyDetail from "./pages/RallyDetail";
import CreatePost from "./pages/CreatePost";
import PostDetail from "./pages/PostDetail";


const App: React.FC = () => {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<Index />} />
                <Route path="/auth/login" element={<Login />} />
                <Route path="/auth/register" element={<Register />} />
                <Route path="/rally/create" element={<CreateRally />} />
                <Route path="/user/profile" element={<Profile />} />
                <Route path="/rallies/:id" element={<RallyDetail />} />
                <Route path="/rallies/:id/publicar" element={<CreatePost />} />
                <Route path="/rallies/:id/publicacion/:id_publicacion" element={<PostDetail />} />
                <Route path="/usuarios/:id" element={<Profile />} />
            </Routes>
        </Router>
    );
};

export default App;