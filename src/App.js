import {
  BrowserRouter,
  Route,
  Routes,
} from "react-router-dom";
import Home from "./routes/Home";
import Test from "./routes/TestChantGPT";

function App() {
  console.log(process.env.PUBLIC_URL);
  return (
      <BrowserRouter>
          <Routes>
              <Route path={process.env.PUBLIC_URL + "/"} element={<Home />} />
              <Route path={process.env.PUBLIC_URL + "/test-chatgpt"} element={<Test />} />
              <Route path={process.env.PUBLIC_URL + "/api/completion-stream"} element={<Test />} />
          </Routes>
      </BrowserRouter>
  );
}

export default App;