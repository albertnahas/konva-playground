import { createSlice } from "@reduxjs/toolkit"
import { State } from "../types/state"

const boardSlice = createSlice({
    name: 'board',
    initialState: {
        zoom: 1,
    },
    reducers: {
        zoomIn: (state) => {
            state.zoom += 1
        },
        zoomOut: (state) => {
            state.zoom -= 1
        }
    }
})

export const boardSelector = (state: State) => state.board
export const { zoomIn, zoomOut } = boardSlice.actions
export default boardSlice.reducer
