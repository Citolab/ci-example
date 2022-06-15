import { IAction } from "@citolab/preact-store";

export type ActionType = "SET_COLOR";

export type Vlak = { id: string; color: string };

export type StateModel = {
  vlakken: Vlak[];
};

export const actions = [
  {
    type: "SET_COLOR",
    action: (state: StateModel, { id, color }: Vlak) => {
      const vlak = state.vlakken.find((vlak) => vlak.id == id);
      const vlakken = vlak
        ? state.vlakken.map((vlak) => (vlak.id == id ? { id: vlak.id, color } : vlak)) // change existing vlak
        : [...state.vlakken, { id, color }]; // or a new vlak
      return { vlakken };
    },
  } as IAction<StateModel, Vlak, ActionType>,
];


