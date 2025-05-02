import React from "react";
import { useNavigate } from "react-router-dom";
import useIsMobile from "../../hooks/useIsMobile";

type Props = {
  title: string;
  subtitle: string;
  info: string;
  path: string;
};

const InfoCard: React.FC<Props> = ({ title, subtitle, info, path }) => {
  const navigate = useNavigate();
  const isMobile = useIsMobile();

  return (
    <div
      onClick={() => navigate(path)}
      style={{
        width: isMobile ? "85vw" : "25vw",
        padding: isMobile ? "4vw" : "2vw",
        borderRadius: isMobile ? "5vw" : "2vw",
        backgroundColor: "white",
        color: "rgb(154, 31, 54)",
        cursor: "pointer",
        boxShadow: "0 4px 20px rgba(154, 31, 54, 0.5)",
        transition: "transform 0.2s ease, box-shadow 0.2s ease",
        margin: "auto",
        textAlign: "center",
      }}
      onMouseEnter={(e) => {
        (e.currentTarget as HTMLElement).style.transform = "scale(1.03)";
        (e.currentTarget as HTMLElement).style.boxShadow =
          "0 4px 30px rgba(154, 31, 54, 0.5)";
      }}
      onMouseLeave={(e) => {
        (e.currentTarget as HTMLElement).style.transform = "scale(1)";
        (e.currentTarget as HTMLElement).style.boxShadow =
          "0 4px 20px rgba(154, 31, 54, 0.5)";
      }}
    >
      <h3
        style={{
          margin: "0 0 1vh",
          fontSize: isMobile ? "4vw" : "1.2vw",
          color: "black",
          fontWeight: 500,
        }}
      >
        {title}
      </h3>
      <h3
        style={{
          margin: "0 0 2vh",
          fontSize: isMobile ? "6vw" : "2vw",
        }}
      >
        {subtitle}
      </h3>
      <p
        style={{
          margin: 0,
          fontSize: isMobile ? "3.5vw" : "0.9vw",
          color: "black",
        }}
      >
        {info}
      </p>
    </div>
  );
};

export default InfoCard;
