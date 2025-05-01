import { useNavigate } from "react-router-dom";
import MenuSection from "../components/MenuSection";

export default function Lunch() {
  const navigate = useNavigate();

  return (
    <div
      style={{
        minHeight: "100vh",
        width: "100vw",
        padding: "4vh 5vw",
        boxSizing: "border-box",
        backgroundColor: "#fdfdfd",
        fontFamily: "Arial, sans-serif",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        color: "#1a1a1a",
      }}
    >
      {/* Back Button */}
      <div style={{ alignSelf: "flex-start", marginBottom: "2vh" }}>
        <button
          onClick={() => navigate("/")}
          style={{
            padding: "1vh 2vw",
            borderRadius: "12px",
            border: "none",
            backgroundColor: "rgb(154, 31, 54)",
            color: "white",
            fontSize: "1rem",
            cursor: "pointer",
            boxShadow: "0 4px 10px rgba(154, 31, 54, 0.3)",
            transition: "background 0.3s ease, transform 0.2s ease",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = "#b02140";
            e.currentTarget.style.transform = "scale(1.02)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = "rgb(154, 31, 54)";
            e.currentTarget.style.transform = "scale(1)";
          }}
        >
          ← Back
        </button>
      </div>

      {/* Title */}
      <h1
        style={{
          fontSize: "3vw",
          color: "rgb(154, 31, 54)",
          marginBottom: "4vh",
          textAlign: "center",
        }}
      >
        RL Lunch Menu
      </h1>

      {/* Menu Sections */}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "3vh",
          width: "100%",
          maxWidth: "900px",
        }}
      >
        <MenuSection
          title="Entrées"
          items={[
            "Quinoa with Chickpeas and Tomatoes",
            "Garlic Pasta",
            "Seasoned Ground Beef",
            "Filipino Pork Tocino",
            "Honey-Ginger Teriyaki Chicken Breast",
          ]}
        />
        <MenuSection
          title="Sides and Vegetables"
          items={[
            "Steamed Cauliflower",
            "White Rice",
            "Steamed Peas and Carrots",
            "Braised Lentils",
            "Rotini (GF)",
          ]}
        />
        <MenuSection
          title="Soups"
          items={["Beef and Vegetable Soup", "Vegetable Chili"]}
        />
      </div>
    </div>
  );
}
