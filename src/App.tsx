import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import Login from "./pages/Login";
import Register from "./pages/Register";
import CreateRally from "./pages/CreateRally";
import Profile from "./pages/Profile";


const App: React.FC = () => {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<Index />} />
                <Route path="/auth/login" element={<Login />} />
                <Route path="/auth/register" element={<Register />} />
                <Route path="/rally/create" element={<CreateRally />} />
                <Route path="/user/profile" element={<Profile />} />
            </Routes>
        </Router>
    );
};

export default App;