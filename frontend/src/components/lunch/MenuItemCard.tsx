import { useState } from "react";

const baseCardStyle = {
  backgroundColor: "rgba(154, 31, 54, 0.1)", // very pale red
  border: "1px solid rgba(154, 31, 54, 0.5)",
  borderRadius: "12px",
  padding: "0.1rem",
  textAlign: "center" as const,
  fontWeight: 500,
  fontSize: "1rem",
  color: "black",
  margin: "0.25rem auto",
  width: "100%",
  minHeight: "80px", // uniform height
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  transition: "box-shadow 0.3s ease",
};

const hoverCardStyle = {
  boxShadow: "0 8px 16px rgba(154, 31, 54, 0.2)",
};

const MenuItemCard = ({ item }: { item: string }) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div
      style={{
        ...baseCardStyle,
        ...(isHovered ? hoverCardStyle : {}),
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {item}
    </div>
  );
};

export default MenuItemCard;
