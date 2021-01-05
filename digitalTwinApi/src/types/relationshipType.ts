export interface RelationshipDefinition {
    source: string;
    name: string;
    target: string;
    [key: string]: any
}

export interface RelationshipObject {
    $relationshipId: string;
    $sourceId: string;
    $relationshipName: string;
    $targetId: string;
    [key: string]: any
}