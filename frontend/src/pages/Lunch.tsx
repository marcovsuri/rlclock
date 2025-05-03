import MenuSection from "../components/lunch/MenuSection";
import BackButton from "../components/home/BackButton";
import useIsMobile from "../hooks/useIsMobile";
import { useLunch } from "../hooks/useLunch";
import { useEffect } from "react";
import { motion } from "framer-motion";

export default function Lunch() {
  const isMobile = useIsMobile();
  const { menu, update: updateMenu } = useLunch();

  useEffect(() => {
    updateMenu();
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
      style={{
        display: "flex",
        flexDirection: "column",
        minHeight: "100vh",
        width: "100vw",
      }}
    >
      <div
        style={{
          minHeight: "100vh",
          width: "100vw",
          padding: "4vh 5vw",
          boxSizing: "border-box",
          backgroundColor: "#fdfdfd",
          fontFamily: "Roboto, sans-serif",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          color: "#1a1a1a",
        }}
      >
        <div
          style={{
            padding: isMobile ? "4vw" : "2vw",
            width: isMobile ? "90vw" : "60vw",
            margin: "2vh auto",
            boxSizing: "border-box",
          }}
        >
          {/* Back Button */}
          <BackButton />

          {/* Title */}
          <h1
            style={{
              fontSize: isMobile ? "5vh" : "3vw",
              color: "rgb(154, 31, 54)",
              marginBottom: "4vh",
              textAlign: "center",
            }}
          >
            RL Lunch Menu
          </h1>
          {/* Title */}
          <h1
            style={{
              fontSize: isMobile ? "5vh" : "3vw",
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
              gap: "1vh",
              width: "100%",
              maxWidth: "900px",
            }}
          >
            <MenuSection
              title="Entrées"
              items={menu?.Entrées.map((item) => item.name) || []}
            />
            <MenuSection
              title="Sides and Vegetables"
              items={
                menu?.["Sides and Vegetables"].map((item) => item.name) || []
              }
            />
            <MenuSection
              title="Soups"
              items={menu?.Soups.map((item) => item.name) || []}
            />
          </div>
        </div>
        );
        {/* Menu Sections */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "1vh",
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
    </motion.div>
  );
}
