import { useState, useCallback } from 'react';
import { Node, Edge } from 'reactflow';

interface HistoryState {
    nodes: Node[];
    edges: Edge[];
}

interface UseHistoryReturn {
    /**Push current state to history before making changes */
    pushHistory: (nodes: Node[], edges: Edge[]) => void;
    /** Undo to previous state */
    undo: () => { nodes: Node[]; edges: Edge[] } | null;
    /** Redo to next state */
    redo: () => { nodes: Node[]; edges: Edge[] } | null;
    /** Check if undo is available */
    canUndo: boolean;
    /** Check if redo is available */
    canRedo: boolean;
    /** Clear all history */
    clearHistory: () => void;
}

export function useHistory(): UseHistoryReturn {
    const [past, setPast] = useState<HistoryState[]>([]);
    const [future, setFuture] = useState<HistoryState[]>([]);

    const pushHistory = useCallback((nodes: Node[], edges: Edge[]) => {
        setPast((prev) => [...prev, { nodes: [...nodes], edges: [...edges] }]);
        setFuture([]); // Clear future when new action is performed
    }, []);

    const undo = useCallback((): { nodes: Node[]; edges: Edge[] } | null => {
        if (past.length === 0) return null;

        const previous = past[past.length - 1];
        const newPast = past.slice(0, -1);

        setPast(newPast);
        setFuture((prev) => [previous, ...prev]);

        return previous;
    }, [past]);

    const redo = useCallback((): { nodes: Node[]; edges: Edge[] } | null => {
        if (future.length === 0) return null;

        const next = future[0];
        const newFuture = future.slice(1);

        setPast((prev) => [...prev, next]);
        setFuture(newFuture);

        return next;
    }, [future]);

    const clearHistory = useCallback(() => {
        setPast([]);
        setFuture([]);
    }, []);

    return {
        pushHistory,
        undo,
        redo,
        canUndo: past.length > 0,
        canRedo: future.length > 0,
        clearHistory,
    };
}
