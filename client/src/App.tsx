import {BrowserRouter, Route, Routes} from "react-router-dom";
import {Login} from "./pages/Login/Login.tsx";
import {LayoutGreen} from "./components/UI/Layout/LayoutGreen.tsx";
import Layout from "./components/UI/Layout/Layout.tsx";
import {CustomerHome} from "./pages/CutomerHome/CustomerHome.tsx";
function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LayoutGreen />}>
            <Route index path="/" element={<Login />}/>
        </Route>
          <Route path="/customer" element={<Layout />}>
              <Route index path="home" element={<CustomerHome />}/>
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App
