import React, { useRef } from "react"
import { Stage, Layer, Rect, Transformer, Group } from "react-konva"
import { useSelector, useDispatch } from "react-redux"
import {
  clearShapes,
  deselectShapes,
  selectShapes,
  shapesSelector,
  updateShape,
  zoomShapesIn,
  zoomShapesOut,
} from "../../store/shapesSlice"
import { Rectangle } from "../Rectangle/Rectangle"
import { KonvaEventObject } from "konva/lib/Node"
import Konva from "konva"
import { boardSelector, zoomIn, zoomOut } from "../../store/boardSlice"
import { showContextMenu } from "../../store/contextMenuSlice"
import {
  BACKGROUND_COLOR,
  RECTANGLE,
  SELECTION_FILL,
  SELECTION_RECT_FILL,
} from "../../constants"
import { rectBoundingBox } from "../../helpers"

const Whiteboard = () => {
  const rectangles = useSelector(shapesSelector)
  const zoom = useSelector(boardSelector).zoom

  const transformerRef = useRef<Konva.Transformer>(null)
  const layerRef = useRef<Konva.Layer>(null)
  const groupRef = useRef<Konva.Group>(null)
  const selectionRectRef = useRef<Konva.Rect>(null)
  const selection = useRef({
    visible: false,
    x1: 0,
    y1: 0,
    x2: 0,
    y2: 0,
  })

  const handleZoomIn = () => {
    dispatch(zoomShapesIn())
    dispatch(zoomIn())
  }

  const handleZoomOut = () => {
    dispatch(zoomShapesOut())
    dispatch(zoomOut())
  }

  const checkDeselect = (e: KonvaEventObject<MouseEvent>) => {
    if (e.target === e.target.getStage()) {
      dispatch(deselectShapes())
      transformerRef.current?.nodes([])
    }
  }

  const updateSelectionRect = () => {
    const node = selectionRectRef.current
    node?.setAttrs({
      visible: selection.current.visible,
      x: Math.min(selection.current.x1, selection.current.x2),
      y: Math.min(selection.current.y1, selection.current.y2),
      width: Math.abs(selection.current.x1 - selection.current.x2),
      height: Math.abs(selection.current.y1 - selection.current.y2),
      fill: SELECTION_FILL,
    })
    node?.getLayer()?.batchDraw()
  }

  const oldPos = useRef(null)

  const dispatch = useDispatch()

  const handleRightClick = (event: KonvaEventObject<MouseEvent>) => {
    event.evt.preventDefault()
    dispatch(showContextMenu({ x: event.evt.clientX, y: event.evt.clientY }))
  }

  const handleMouseDown = (e: KonvaEventObject<MouseEvent>) => {
    if (e.evt.button === 2) {
      return
    }
    checkDeselect(e)

    const isElement = e.target.findAncestor(".elements-container")
    const isTransformer = e.target.findAncestor("Transformer")
    const pos = e.target.getStage()?.getPointerPosition()
    if (isElement || isTransformer || !pos) {
      return
    }
    selection.current = {
      ...selection.current,
      visible: true,
      x1: pos.x,
      y1: pos.y,
      x2: pos.x,
      y2: pos.y,
    }
    updateSelectionRect()
  }

  const handleMouseMove = (e: KonvaEventObject<MouseEvent>) => {
    const pos = e.target.getStage()?.getPointerPosition()
    if (!selection.current.visible || !pos) {
      return
    }
    selection.current.x2 = pos.x
    selection.current.y2 = pos.y
    updateSelectionRect()
  }

  const handleMouseUp = (e: KonvaEventObject<MouseEvent>) => {
    if (e.evt.button === 2) {
      return
    }

    oldPos.current = null
    if (!selection.current.visible) {
      return
    }
    const selBox = selectionRectRef.current?.getClientRect()

    const elements: Konva.Node[] = []
    layerRef.current?.find(`.${RECTANGLE}`).forEach((elementNode) => {
      const elBox = elementNode.getClientRect()
      if (selBox && Konva.Util.haveIntersection(selBox, elBox)) {
        elements.push(elementNode)
      }
    })
    transformerRef.current?.nodes(elements)
    dispatch(selectShapes(elements.map((el) => Number(el.id()))))
    selection.current.visible = false
    window.Konva.listenClickTap = false
    updateSelectionRect()
  }

  const handleClear = () => {
    dispatch(clearShapes())
    transformerRef?.current?.nodes([])
  }

  const zoomVal = 100 + 100 * (0.1 * (zoom - 1))

  return (
    <div>
      <h1>Drawing board</h1>
      <Stage
        width={window.innerWidth}
        height={400}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onContextMenu={handleRightClick}
        style={{ border: "1px solid #ccc", background: BACKGROUND_COLOR }}
      >
        <Layer ref={layerRef}>
          <Group ref={groupRef}>
            {rectangles.map((rect, i) => (
              <Rectangle
                key={i}
                shape={rect}
                onChange={(newAttrs) => {
                  dispatch(updateShape({ ...rect, ...newAttrs }))
                }}
              />
            ))}
            <Transformer
              ref={transformerRef}
              boundBoxFunc={(oldBox, newBox) => {
                if (newBox.width < 5 || newBox.height < 5) {
                  return oldBox
                }
                return newBox
              }}
            />
            <Rect fill={SELECTION_RECT_FILL} ref={selectionRectRef} />
          </Group>
        </Layer>
      </Stage>
      <div style={{ marginTop: 16 }}>
        <button onClick={handleZoomIn}>Zoom In</button>
        <button onClick={handleZoomOut}>Zoom Out</button>
        <span style={{ margin: "0 10px" }}>{Math.round(zoomVal)}%</span>
      </div>
      <div style={{ marginTop: 8 }}>
        <button onClick={handleClear}>Clear</button>
      </div>
    </div>
  )
}
export default Whiteboard

declare global {
  interface Window {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    Konva: any
  }
}

window.Konva = window.Konva || {}
