import { renderHook } from "@testing-library/react";
import { act } from "react-dom/test-utils";
import { useAsyncTask } from "./useAsyncTask";

describe("useAsyncTask", () => {
    it("stop loading when promise rejects", async () => {
        const { result: { current } } = renderHook(
            ({ fn }) => useAsyncTask(fn),
            {
                initialProps: {
                    fn: async () => {
                        throw new Error("hello, world!");
                    },
                },
            }
        );

        const [exec, { loading, error }] = current;

        await act(async () => await exec());

        expect(loading).toBe(false);
        expect(error).toBe(new Error("hello, world!"));
    });
});

export { };