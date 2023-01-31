export interface BoardShape {
    id?: number
    type: string
    x: number
    y: number
    width: number
    height: number
    fill: string
    stroke?: string
    rotation?: number
    scaleX?: number
    scaleY?: number
    draggable?: boolean
}