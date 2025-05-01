import React from "react";
import Clock from "../components/Clock";
import InfoCard from "../components/InfoCard";

const Home: React.FC = () => {
  return (
    <div style={{ padding: "2rem", textAlign: "center" }}>
      <Clock />

      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          margin: "2rem auto 0",
          gap: "0.5rem",
          maxWidth: "50vw", // match Clock's width
        }}
      >
        <InfoCard
          title="Today's Lunch:"
          subtitle="Chicken Alfredo"
          info="Click to see full menu!"
          path="/lunch"
        />
        <InfoCard
          title="Latest Result: "
          subtitle="Varsity Soccer 2-1 Win"
          info="Click to see other results!"
          path="/sports"
        />
      </div>
    </div>
  );
};

export default Home;
