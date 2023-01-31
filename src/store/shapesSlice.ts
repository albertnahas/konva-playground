import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { rectBoundingBox } from '../helpers';
import { BoardShape } from '../types/boardShape';
import { shapesState, State } from '../types/state';

const initialState: shapesState = {
    shapes: [],
    selectedShapes: [],
};

const ALING_SPACING = 10;

const shapesSlice = createSlice({
    name: 'shapes',
    initialState,
    reducers: {
        addShape: (state, action: PayloadAction<BoardShape>) => {
            state.shapes.push({
                id: state.shapes.length,
                draggable: true,
                ...action.payload,
            });
        },
        removeShape: (state, action: PayloadAction<number>) => {
            state.shapes = state.shapes.filter(shape => shape.id !== action.payload);
            state.selectedShapes = state.selectedShapes.filter(id => id !== action.payload);
        },
        clearShapes: (state) => {
            state.shapes = [];
            state.selectedShapes = [];
        },
        selectShapes: (state, action: PayloadAction<number[]>) => {
            state.selectedShapes = action.payload;
        },
        deselectShapes: (state) => {
            state.selectedShapes = [];
        },
        updateShape: (state, action: PayloadAction<BoardShape>) => {
            const shape = state.shapes.find(shape => shape.id === action.payload.id);
            if (shape) {
                Object.assign(shape, action.payload);
            }
        },
        alignTop: (state) => {
            const shapes = state.shapes.filter(shape => shape.id !== undefined && state.selectedShapes.includes(shape.id));
            const boxes = shapes.map(shape => rectBoundingBox(shape));
            const top = Math.min(...boxes.map(shape => shape.y));
            shapes.forEach(shape => {

                const shapeBox = rectBoundingBox(shape);
                const allBoxes = state.shapes.map(s => rectBoundingBox(s));
                const shapesOnTop = allBoxes.filter(s => s.y < shapeBox.y && s.x < shapeBox.x + shapeBox.width && s.x + s.width > shapeBox.x);
                if (shapesOnTop.length > 0) {
                    const bottom = Math.max(...shapesOnTop.map(s => s.y + s.height));
                    shape.y = bottom + ALING_SPACING + (shapeBox.y - shape.y);
                } else {
                    shape.y = top;
                }
            });
        },
        alignBottom: (state) => {
            const shapes = state.shapes.filter(shape => shape.id !== undefined && state.selectedShapes.includes(shape.id));
            const boxes = shapes.map(shape => rectBoundingBox(shape));
            const bottom = Math.max(...boxes.map(shape => shape.y + shape.height));
            shapes.forEach(shape => {
                const shapeBox = rectBoundingBox(shape);
                const allBoxes = state.shapes.map(s => rectBoundingBox(s));
                const shapesOnBottom = allBoxes.filter(s => s.y + s.height > shapeBox.y + shapeBox.height && s.x < shapeBox.x + shapeBox.width && s.x + s.width > shapeBox.x);
                if (shapesOnBottom.length > 0) {
                    const top = Math.min(...shapesOnBottom.map(s => s.y));
                    shape.y = top - ALING_SPACING - shapeBox.height + (shapeBox.y - shape.y);
                } else {
                    shape.y = bottom - shapeBox.height;
                }
            });
        },
        zoomShapesIn: (state) => {
            state.shapes.forEach(shape => {
                shape.x = shape.x * 1.1;
                shape.y = shape.y * 1.1;
                shape.width = shape.width * 1.1;
                shape.height = shape.height * 1.1;
            });
        },
        zoomShapesOut: (state) => {
            state.shapes.forEach(shape => {
                shape.x = shape.x * 0.9;
                shape.y = shape.y * 0.9;
                shape.width = shape.width * 0.9;
                shape.height = shape.height * 0.9;
            });
        }

    }
});

export const selectedShapesSelector = (state: State) =>
    state.shapes.selectedShapes.map(id => state.shapes.shapes.find(shape => shape.id === id));

export const shapesSelector = (state: State) => state.shapes.shapes;

export const { selectShapes, alignTop, alignBottom, addShape, clearShapes, removeShape, deselectShapes, updateShape, zoomShapesIn, zoomShapesOut } = shapesSlice.actions;

export default shapesSlice.reducer;