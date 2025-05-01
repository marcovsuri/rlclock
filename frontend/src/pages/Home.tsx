import React from "react";
import Clock from "../components/Clock";
import InfoCard from "../components/InfoCard";
import useIsMobile from "../hooks/useIsMobile";

const Home: React.FC = () => {
  const isMobile = useIsMobile();

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        minHeight: "100vh",
        width: "100vw",
      }}
    >
      {/* Main Content Area */}
      <div
        style={{
          flex: 1,
          display: "flex",
          flexDirection: isMobile ? "column" : "row",
          justifyContent: "center",
          alignItems: "center",
          gap: isMobile ? "1vh" : "3vw",
          padding: "2vw",
          boxSizing: "border-box",
          textAlign: "center",
        }}
      >
        {/* Clock */}
        <div style={{ width: isMobile ? "100%" : "auto" }}>
          <Clock />
        </div>

        {/* Info Cards */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center", // center on mobile
            gap: isMobile ? "1vh" : "3vw",
            width: isMobile ? "100%" : "30vw",
          }}
        >
          <InfoCard
            title="Today's Lunch:"
            subtitle="Chicken Alfredo"
            info="Click to see full menu!"
            path="/lunch"
          />
          <InfoCard
            title="Latest Result:"
            subtitle="Varsity Soccer 2-1 Win"
            info="Click to see other results!"
            path="/sports"
          />
        </div>
      </div>

      {/* Footer */}
      <footer
        className="footer"
        style={{
          padding: "4vh",
          textAlign: "center",
          background: "transparent",
          fontSize: isMobile ? "1.5vh" : "1vw", // base font size responsive to screen width
        }}
      >
        <div className="container" style={{ marginBottom: "0.5vh" }}>
          <span className="text-muted">
            A friendly 🦊&nbsp; re/creation. ©&nbsp;2025
          </span>
        </div>
        <div className="container">
          <span
            className="text-muted"
            style={{
              fontSize: isMobile ? "1vh" : "0.75vw", // smaller responsive font size
              opacity: 0.7,
            }}
          >
            Full credit to the creators of the original RL Clock. ✌️
          </span>
        </div>
      </footer>
    </div>
  );
};

export default Home;
