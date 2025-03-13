import plugin from "@krainovsd/presets/eslint";

export default [
  ...plugin.presets.testing,
  ...plugin.presets.javascript,
  ...plugin.presets.typescript,

  {
    ignores: ["tmp/", "node_modules/", "lib/", ".turbo/", "stats/", "coverage/", "dist/"],
  },
  {
    rules: {
      "max-params": ["off", { max: 4 }],
      "id-length": [
        "error",
        { exceptions: ["x", "y", "z", "i", "j", "_", "t", "r", "g", "b", "k"] },
      ],
    },
  },
];
