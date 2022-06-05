import {
  BrowserRouter as Router,
  Routes as Switch,
} from "react-router-dom";
import Signin from "../src/components/Signin";

const Routes = () => {
  return (
    <Router>
      <Switch>
        <Router path="/login" element={<Signin />} />
      </Switch>
    </Router>
  );
};

export default Routes;
