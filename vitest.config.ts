import { defineConfig } from "vitest/config";

export default defineConfig({
    test: {
        globals: true,
        environment: "node",
        include: ["tests/**/*.test.ts"],
        testTimeout: 300000,
        maxWorkers: 1,
        coverage: {
            provider: "v8",
            reporter: ["text"],
            include: ["src/**/*.ts"],
            exclude: ["tests/**", "examples/**"],
        },
    },
});
