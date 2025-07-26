import { ChartNetwork } from "lucide-react";
import SearchBar from "./SearchBar";

function Navbar({ setEtalDataGraphRender }) {
  return (
    <header className="navBar">
      <div className="navContent">
        <div className="leftBar">
          <div className="img_and_name">
            <ChartNetwork strokeWidth={0.5} color="#845799" size={35} />
            <p
              className="name"
              style={{
                fontSize: "25px",
                margin: "0",
                fontFamily: '"Poiret One", sans-serif',
                color: "rgb(180, 30, 255)",
              }}
            >
              etAL
            </p>
          </div>
          <p className="slogan">Join the Conversation</p>
        </div>
        <div className="rightBar">
          <button>FAQ</button>
          <button>About Us</button>
          <button>Login</button>
        </div>
      </div>
      <SearchBar setEtalDataGraphRender={setEtalDataGraphRender} />
    </header>
  );
}
export default Navbar;
