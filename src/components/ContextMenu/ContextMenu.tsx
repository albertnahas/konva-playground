import React, { useEffect, useRef } from "react"
import { useSelector, useDispatch } from "react-redux"
import {
  DEFAULT_FILL,
  DEFAULT_RECTANGLE_HEIGHT,
  DEFAULT_RECTANGLE_WIDTH,
  DEFAULT_STROKE,
  RECTANGLE,
} from "../../constants"
import {
  contextMenuSelector,
  hideContextMenu,
} from "../../store/contextMenuSlice"
import { addShape, alignBottom, alignTop } from "../../store/shapesSlice"
import { BoardShape } from "../../types/boardShape"

const ContextMenu: React.FC = () => {
  const contextMenuRef = useRef<HTMLDivElement>(null)
  const { visible, x, y } = useSelector(contextMenuSelector)
  const dispatch = useDispatch()

  const onClickAlignTop = () => {
    dispatch(alignTop())
    dispatch(hideContextMenu())
  }
  const onClickAlignBottom = () => {
    dispatch(alignBottom())
    dispatch(hideContextMenu())
  }

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      e.stopPropagation()
      if (
        contextMenuRef.current &&
        !contextMenuRef.current.contains(e.target as Node)
      ) {
        dispatch(hideContextMenu())
      }
    }
    document.addEventListener("click", handleClick)
    return () => {
      document.removeEventListener("click", handleClick)
    }
  }, [contextMenuRef])

  const onClickDropRectangle = (
    e: React.MouseEvent<HTMLLIElement, MouseEvent>
  ) => {
    e.stopPropagation()
    const canvasX = document
      .getElementsByTagName("canvas")[0]
      ?.getBoundingClientRect().left
    const canvasY = document
      .getElementsByTagName("canvas")[0]
      ?.getBoundingClientRect().top

    const rect: BoardShape = {
      type: RECTANGLE,
      x: x - canvasX,
      y: y - canvasY,
      width: DEFAULT_RECTANGLE_WIDTH,
      height: DEFAULT_RECTANGLE_HEIGHT,
      fill: DEFAULT_FILL,
      stroke: DEFAULT_STROKE,
    }
    dispatch(addShape(rect))
    dispatch(hideContextMenu())
  }

  return (
    <div
      ref={contextMenuRef}
      className="context-menu"
      style={{
        display: visible ? "block" : "none",
        top: y,
        left: x,
      }}
    >
      <ul>
        <li onClick={onClickDropRectangle}>Drop rectangle</li>
        <li onClick={onClickAlignTop}>Align top</li>
        <li onClick={onClickAlignBottom}>Align bottom</li>
      </ul>
    </div>
  )
}

export default ContextMenu
