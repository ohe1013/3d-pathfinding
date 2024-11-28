import { createContext } from "react";
import { EntityManager } from "yuka";

export const entityContext = createContext<EntityManager | null>(null);
