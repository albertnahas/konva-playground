import { createSlice, PayloadAction } from "@reduxjs/toolkit"
import { State } from "../types/state"

const contextMenuSlice = createSlice({
    name: 'contextMenu',
    initialState: {
        x: 0,
        y: 0,
        visible: false,
    },
    reducers: {
        showContextMenu: (state, action: PayloadAction<{ x: number, y: number }>) => {
            state.x = action.payload.x
            state.y = action.payload.y
            state.visible = true
        },
        hideContextMenu: (state) => {
            state.visible = false
        }
    }
})

export const contextMenuSelector = (state: State) => state.contextMenu
export const { showContextMenu, hideContextMenu } = contextMenuSlice.actions
export default contextMenuSlice.reducer
