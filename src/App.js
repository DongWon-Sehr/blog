import {
  BrowserRouter,
  Route,
  Routes,
} from "react-router-dom";
import Home from "./routes/Home";

function App() {
  console.log(process.env.PUBLIC_URL);
  return (
      <BrowserRouter>
          <Routes>
              <Route path={process.env.PUBLIC_URL + "/"} element={<Home />} />
          </Routes>
      </BrowserRouter>
  );
}

export default App;