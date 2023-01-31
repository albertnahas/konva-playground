import Konva from "konva"
import React, { FC, RefObject } from "react"
import { Rect } from "react-konva"
import { RECTANGLE } from "../../constants"
import { BoardShape } from "../../types/boardShape"

interface RectangleProps {
  shape: BoardShape
  onSelect?: (shapeRef: RefObject<Konva.Rect>) => void
  onChange?: (shape: BoardShape) => void
}

export const Rectangle: FC<RectangleProps> = ({
  shape,
  onSelect,
  onChange,
}) => {
  const shapeRef = React.useRef<Konva.Rect>(null)
  const { id, ...shapeProps } = shape
  return (
    <Rect
      {...shapeProps}
      ref={shapeRef}
      onClick={() => onSelect?.(shapeRef)}
      onTap={() => onSelect?.(shapeRef)}
      id={id?.toString()}
      name={RECTANGLE}
      draggable
      onDragEnd={(e) => {
        onChange?.({
          ...shape,
          x: e.target.x(),
          y: e.target.y(),
        })
        e.evt.stopPropagation()
      }}
      onTransformEnd={() => {
        const node = shapeRef.current
        if (!node) {
          return
        }
        const scaleX = node.scaleX()
        const scaleY = node.scaleY()
        node.scaleX(1)
        node.scaleY(1)
        onChange?.({
          ...shapeProps,
          x: node.x(),
          y: node.y(),
          width: Math.max(5, node.width() * scaleX),
          height: Math.max(node.height() * scaleY),
          rotation: node.rotation(),
        })
      }}
    />
  )
}
