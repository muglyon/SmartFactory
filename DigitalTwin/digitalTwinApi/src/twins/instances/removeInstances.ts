import { DigitalTwinsClient } from "@azure/digital-twins-core";

export default function removeInstances(service: DigitalTwinsClient, instances: string[]) {
    for (let instance in instances) {
        service.deleteDigitalTwin(instance)
    }
}