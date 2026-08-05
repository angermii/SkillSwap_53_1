import { createSlice, type PayloadAction } from "@reduxjs/toolkit"
import { getFavorites, saveFavorites } from "./favoritesUtils"

export interface FavoritesState {
    ids: string[]
};

const initialState: FavoritesState = {
    ids: getFavorites(),
};

const favoritesSlice = createSlice({
    name: 'favorites',
    initialState,
    reducers: {
        toggleFavorite: (state, action: PayloadAction<string>) => {
            const id = action.payload

            if (state.ids.includes(id)) {
                state.ids = state.ids.filter((item) => item !== id)
            } else {
                state.ids.push(id)
            }

            saveFavorites(state.ids)
        }
    }
});

export const { toggleFavorite } = favoritesSlice.actions;

export default favoritesSlice.reducer