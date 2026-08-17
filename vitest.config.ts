/**
 * Standalone test config: the plugin repo has no build toolchain of its own
 * (tsconfig/tsdown point into the deepseek-harness monorepo mirror), so the
 * repo's tsconfig.json cannot be discovered here — its `extends` resolves to a
 * monorepo-relative base that does not exist in this checkout. Oxc is told to
 * use inline tsconfig options instead of auto-discovery (its JSX runtime
 * defaults to `automatic`). Tests import only `type` from @deepseek-ai/*
 * packages, which the transform strips at runtime, so no platform packages are
 * needed here.
 */
import { defineConfig } from 'vitest/config'

export default defineConfig({
  oxc: {
    tsconfig: { compilerOptions: {} },
  },
})
