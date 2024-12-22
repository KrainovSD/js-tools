/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
import React from "react";
import { ICON_CATEGORIES } from "../categories";
import { Icon } from "../icon";
import type { IconName } from "../types";

export function IconPage() {
  const [color, setColor] = React.useState("black");
  const [filter, setFilter] = React.useState("");

  return (
    <div
      style={{
        width: "100vw",
        height: "100vh",
        padding: "20px",
        display: "flex",
        flexDirection: "column",
        fontSize: "18px",
        gap: "20px",
        boxSizing: "border-box",
      }}
    >
      <div style={{ display: "flex", flexDirection: "column", gap: "5px" }}>
        <input
          type="text"
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          placeholder="Поиск"
          style={{ fontSize: "18px" }}
        />
        <input type="color" value={color} onChange={(e) => setColor(e.target.value)} />
      </div>
      {ICON_CATEGORIES.map((category) => {
        return (
          <div key={category.id} style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
            <span>{category.text}</span>
            <div
              style={{
                display: "flex",
                flexDirection: "row",
                flexWrap: "wrap",
                rowGap: "10px",
                columnGap: "20px",
              }}
            >
              {category.icons.map((icon) => {
                if (
                  filter.trim().length !== 0 &&
                  !icon.toLowerCase().trim().includes(filter.toLowerCase().trim())
                )
                  return null;

                return (
                  <div
                    key={icon}
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      gap: "5px",
                      alignItems: "center",
                      justifyContent: "center",
                      border: "1px solid black",
                      padding: "5px",
                      cursor: "pointer",
                    }}
                    onClick={() => {
                      void navigator.clipboard.writeText(icon);
                    }}
                  >
                    <Icon icon={icon as IconName} size={24} color={color} />
                    <span>{icon}</span>
                  </div>
                );
              })}
            </div>
          </div>
        );
      })}
    </div>
  );
}
