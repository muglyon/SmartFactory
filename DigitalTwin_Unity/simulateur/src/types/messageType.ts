export interface Datas {
   isRunning: boolean;
   isGripperOpen: boolean
   workOrder: string;
   position: Position
}

export interface Position {
    x: number;
    y: number;
    z: number
}