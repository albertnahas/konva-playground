import { BoardShape } from "./boardShape"

export interface State {
    contextMenu: ContextMenuState
    shapes: shapesState
    board: boardState
}

export interface ContextMenuState {
    x: number
    y: number
    visible: boolean
}

export interface shapesState {
    shapes: BoardShape[];
    selectedShapes: number[];
}

export interface boardState {
    zoom: number
}