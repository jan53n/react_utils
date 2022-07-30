import { useReducer } from "react";

export type AsyncFn = (...args: unknown[]) => Promise<unknown>;

type TaskState = {
    error: unknown,
    loading: boolean,
    success: boolean,
    data: unknown
};

type TaskResponse = [(...args: unknown[]) => void, TaskState];

type TaskAction = {
    type: "data",
    payload?: unknown
} | {
    type: "error",
    payload: Error,
} | {
    type: "init"
};

const INITIAL_STATE: TaskState = {
    error: undefined,
    loading: false,
    success: false,
    data: undefined
};

/**
 * executing asynchronous tasks and managing it's side-effects
 */
function reducer(_state: TaskState, action: TaskAction): TaskState {
    let newState!: TaskState;

    switch (action.type) {
        case "init":
            newState = {
                ...INITIAL_STATE,
                loading: true,
            };
            break;
        case "data":
            newState = {
                ...INITIAL_STATE,
                loading: false,
                success: true,
                data: action?.payload
            };
            break;
        case "error":
            newState = {
                ...INITIAL_STATE,
                error: action?.payload,
            };
            break;
        default:
            throw new Error("unknown action dispatched!");
    }

    return newState;
}

export function useAsyncTask(fn: AsyncFn): TaskResponse {
    const [state, dispatch] = useReducer(reducer, INITIAL_STATE);

    const wrappedFn = async (...args: unknown[]) => {

        dispatch({ type: "init" });

        try {
            const response = await fn(...args);
            dispatch({ type: "data", payload: response });
        } catch (error) {
            dispatch({ type: "error", payload: (error as Error) });
        }
    };

    return [wrappedFn, state];
}