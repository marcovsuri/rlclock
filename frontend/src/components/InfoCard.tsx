import React from "react";
import { useNavigate } from "react-router-dom";

type Props = {
  title: string;
  subtitle: string;
  info: string;
  path: string;
};

const InfoCard: React.FC<Props> = ({ title, subtitle, info, path }) => {
  const navigate = useNavigate();

  return (
    <div
      onClick={() => navigate(path)}
      style={{
        maxWidth: "30vw",
        minWidth: "20vw",
        padding: "2rem",
        borderRadius: "16px",
        backgroundColor: "white", // pastel red + transparency
        color: "rgb(154, 31, 54)",
        cursor: "pointer",
        boxShadow: "0 4px 20px rgb(154, 31, 54, 0.5)",
        transition: "transform 0.2s ease, box-shadow 0.2s ease",
        margin: "1rem auto",
        textAlign: "center",
      }}
      onMouseEnter={(e) => {
        (e.currentTarget as HTMLElement).style.transform = "scale(1.03)";
        (e.currentTarget as HTMLElement).style.boxShadow =
          "0 4px 30px rgb(154, 31, 54, 0.5)";
      }}
      onMouseLeave={(e) => {
        (e.currentTarget as HTMLElement).style.transform = "scale(1)";
        (e.currentTarget as HTMLElement).style.boxShadow =
          "0 4px 20px rgb(154, 31, 54, 0.5)";
      }}
    >
      <h3
        style={{
          margin: "0 0 0.5rem",
          fontSize: "1rem",
          color: "black",
          fontWeight: 500,
        }}
      >
        {title}
      </h3>
      <h3 style={{ margin: "0 0 0.5rem", fontSize: "2rem" }}>{subtitle}</h3>
      <p style={{ margin: 0, fontSize: "0.8rem", color: "black" }}>{info}</p>
    </div>
  );
};

export default InfoCard;
