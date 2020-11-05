export interface DataInterface {
    [itemKey: string]: ItemType | DataInterface
}

export type ItemType = (CustomItem & TimestampedObject)[]

export interface InitialDataInterface {
    [itemKey: string]: CustomItem
}

export interface CustomItem {
    [sensorKey: string]: any
}

export interface TimestampedObject {
    timestamp: Date;
}

export interface PublishedItem {
    Value: {
        SourceTimestamp: string,
        Value: any
    },
    DisplayName: string;
}

export interface MessagePreparationType {
    items: DataInterface,
    newInitialData: InitialDataInterface,
  }