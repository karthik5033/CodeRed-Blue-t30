import { Node, Edge } from "reactflow";

// TOON Format:
// NODES:
// id|type|label|x|y|color|description
//
// EDGES:
// source|target|label
//
// Separator: ~

export function toTOON(nodes: Node[], edges: Edge[]): string {
    const nodesStr = nodes.map(n => {
        const x = Math.round(n.position.x);
        const y = Math.round(n.position.y);
        const color = n.data.color || "#ffffff";
        const label = n.data.label || "";
        const description = n.data.description || "";
        return `${n.id}|${n.type}|${label}|${x}|${y}|${color}|${description}`;
    }).join("\n");

    const edgesStr = edges.map(e => {
        return `${e.source}|${e.target}|${e.label || ""}`;
    }).join("\n");

    return `NODES:\n${nodesStr}\n~EDGES:\n${edgesStr}`;
}

export function fromTOON(toonStr: string): { nodes: any[], edges: any[] } | null {
    try {
        const [nodePart, edgePart] = toonStr.split("~EDGES:");
        if (!nodePart) return null;

        const nodes = nodePart.replace("NODES:\n", "").trim().split("\n").map(line => {
            const [id, type, label, x, y, color, description] = line.split("|");
            return {
                id,
                type,
                position: { x: parseInt(x), y: parseInt(y) },
                data: { label, color, description: description || "" },
                style: { backgroundColor: color } // standard style mapping
            };
        });

        const edges = edgePart ? edgePart.trim().split("\n").map((line, idx) => {
            const [source, target, label] = line.split("|");
            return {
                id: `e${idx}`,
                source,
                target,
                label
            };
        }) : [];

        return { nodes, edges };
    } catch (e) {
        console.error("TOON Parse Error", e);
        return null;
    }
}
