import { Node, Edge } from "reactflow";

export interface FlowData {
    nodes: Node[];
    edges: Edge[];
}

export function extractFlowData(responseText: string): FlowData | null {
    // Regex handles:
    // 1. ```json ... ``` (multiline or inline)
    // 2. ``` ... ``` (generic block if it looks like JSON)
    // 3. Raw JSON object starting with { "nodes": ...
    const jsonMatch = responseText.match(/```(?:json)?\s*({[\s\S]*?"nodes"[\s\S]*?"edges"[\s\S]*?})\s*```/) ||
        responseText.match(/({[\s\S]*?"nodes"[\s\S]*?"edges"[\s\S]*?})/);

    if (jsonMatch) {
        try {
            const jsonStr = jsonMatch[1] || jsonMatch[0];
            const flowData = JSON.parse(jsonStr);
            if (flowData.nodes && flowData.edges) {
                return flowData as FlowData;
            }
        } catch (e) {
            console.error("Failed to parse AI flow JSON", e);
        }
    }
    return null;
}
