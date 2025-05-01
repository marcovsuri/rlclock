import React from "react";
import Clock from "../components/Clock";
import InfoCard from "../components/InfoCard";

const Home: React.FC = () => {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh", // full viewport height
        width: "100vw",
        padding: "2rem",
        boxSizing: "border-box",
        gap: "3rem",
      }}
    >
      {/* Clock Component */}
      <Clock />

      {/* Info Cards Column */}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          gap: "1rem",
          maxWidth: "30vw",
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
  );
};

export default Home;
