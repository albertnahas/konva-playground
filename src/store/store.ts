import { configureStore } from '@reduxjs/toolkit'
import { State } from '../types/state'
import contextMenuReducer from './contextMenuSlice'
import shapesReducer from './shapesSlice'
import boardReducer from './boardSlice'


const store = configureStore<State>({
    reducer: {
        contextMenu: contextMenuReducer,
        shapes: shapesReducer,
        board: boardReducer,
    },

})

export default store