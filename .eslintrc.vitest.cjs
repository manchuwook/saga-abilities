// filepath: x:\dev\saga-abilities\.eslintrc.vitest.cjs
module.exports = {
    root: false, // Not root, extends the main config
    extends: [
        './.eslintrc.cjs',
    ],
    overrides: [
        {
            files: ['**/*.test.ts', '**/*.test.tsx', '**/*.spec.ts', '**/*.spec.tsx'],
            env: {
                'vitest': true,
            },
        },
    ],
};