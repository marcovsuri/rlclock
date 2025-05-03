import { useEffect } from "react";
import { motion } from "framer-motion";
import BackButton from "../components/home/BackButton";
import MenuSection from "../components/lunch/MenuSection";
import useIsMobile from "../hooks/useIsMobile";
import { useLunch } from "../hooks/useLunch";

export default function Lunch() {
  const isMobile = useIsMobile();
  const { menu, update: updateMenu } = useLunch();

  useEffect(() => {
    updateMenu();
  }, []);

  const containerStyle: React.CSSProperties = {
    display: "flex",
    flexDirection: "column",
    minHeight: "100vh",
    width: "100vw",
  };

  const innerStyle: React.CSSProperties = {
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
  };

  const contentStyle: React.CSSProperties = {
    padding: isMobile ? "4vw" : "2vw",
    width: isMobile ? "90vw" : "60vw",
    margin: "2vh auto",
    boxSizing: "border-box",
  };

  const titleStyle: React.CSSProperties = {
    fontSize: isMobile ? "5vh" : "3vw",
    color: "rgb(154, 31, 54)",
    marginBottom: "4vh",
    textAlign: "center",
  };

  const sectionContainerStyle: React.CSSProperties = {
    display: "flex",
    flexDirection: "column",
    gap: "1vh",
    width: "100%",
    maxWidth: "900px",
  };

  const noLunchStyle: React.CSSProperties = {
    textAlign: "center",
    fontSize: "1.2rem",
    color: "#555",
    marginTop: "2vh",
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
      style={containerStyle}
    >
      <div style={innerStyle}>
        <div style={contentStyle}>
          <BackButton />
          <h1 style={titleStyle}>RL Lunch Menu</h1>

          {menu ? (
            <div style={sectionContainerStyle}>
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
          ) : (
            <p style={noLunchStyle}>No lunch served today.</p>
          )}
        </div>
      </div>
    </motion.div>
  );
}
