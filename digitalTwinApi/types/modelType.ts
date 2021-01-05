export interface Model {
    '@context': string;
    '@id': string;
    '@type': 'Interface',
    displayName: string;
    contents: ModelContent[];
    extends?: string[];
}

export interface ModelContent {
    "@type": "Property" | "Component" | "Command" | "Telemetry" | "Relationship";
    "name": string;
    "schema"?: string | any;
    "target"?: string;
}

export interface ModelList {
    [key: string]: Model
}
export interface ModelContentList {
    [key: string]: ModelContent[]
}