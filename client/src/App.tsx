import {BrowserRouter, Route, Routes} from "react-router-dom";
import {Login} from "./pages/Login/Login.tsx";
import {LayoutGreen} from "./components/UI/Layout/LayoutGreen.tsx";
function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LayoutGreen />}>
            <Route index path="/" element={<Login />}/>
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App
