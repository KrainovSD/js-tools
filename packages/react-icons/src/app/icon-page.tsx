import React from "react";
import { Icon } from "../icon";
import { Icons } from "../icons";
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
        overflow: "hidden",
      }}
    >
      <div style={{ display: "flex", flexDirection: "column", gap: "5px" }}>
        <input
          type="text"
          value={filter}
          onChange={(event) => setFilter(event.target.value)}
          placeholder="Поиск"
          style={{ fontSize: "18px" }}
        />
        <input type="color" value={color} onChange={(event) => setColor(event.target.value)} />
        <span>Всего элементов: {Object.keys(Icons).length}</span>
      </div>
      <div style={{ display: "flex", gap: "10px", flexWrap: "wrap", overflow: "auto" }}>
        {Object.keys(Icons).map((name) => {
          if (
            (filter.trim().length !== 0 &&
              name.toLowerCase().trim().includes(filter.toLowerCase().trim())) ||
            filter.trim().length === 0
          )
            return (
              <button
                key={name}
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
                  void window.navigator.clipboard.writeText(name);
                }}
              >
                <Icon icon={name as IconName} size={24} color={color} />
                <span>{name}</span>
              </button>
            );

          return null;
        })}
      </div>
    </div>
  );
}
