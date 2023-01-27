import {
  BrowserRouter,
  Route,
  Routes,
} from "react-router-dom";
import Home from "./routes/Home";
import Test from "./routes/Test";

function App() {
  console.log(process.env.PUBLIC_URL);
  return (
      <BrowserRouter>
          <Routes>
              <Route path={process.env.PUBLIC_URL + "/"} element={<Home />} />
              <Route path={process.env.PUBLIC_URL + "/Test"} element={<Test />} />
          </Routes>
      </BrowserRouter>
  );
}

export default App;