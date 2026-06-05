import type { Team } from "./types";

/** 10 fictional factory teams. Colors match the design system palette. */
export const teams: Team[] = [
  { id: "vortex", name: "Vortex Racing", color: "#E8001C", engine: "V4", country: "Italy" },
  { id: "azura", name: "Azura Works", color: "#00AAFF", engine: "Inline-4", country: "Japan" },
  { id: "helix", name: "Helix Factory", color: "#FF6600", engine: "V4", country: "Brazil" },
  { id: "kodex", name: "Kodex GP", color: "#00FF88", engine: "Inline-4", country: "Germany" },
  { id: "phantom", name: "Phantom Squad", color: "#AA00FF", engine: "V4", country: "France" },
  { id: "ironfront", name: "Ironfront Racing", color: "#FFD000", engine: "Inline-4", country: "Austria" },
  { id: "zenith", name: "Zenith MotoSport", color: "#FFFFFF", engine: "V4", country: "Spain" },
  { id: "dune", name: "Dune Eleven", color: "#CC7700", engine: "Inline-4", country: "South Africa" },
  { id: "celsius", name: "Celsius RT", color: "#00DDDD", engine: "V4", country: "Czechia" },
  { id: "nova", name: "Nova Moto", color: "#FF0088", engine: "Inline-4", country: "Australia" },
];

export const teamById = (id: string): Team | undefined =>
  teams.find((t) => t.id === id);
