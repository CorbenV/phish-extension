import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { resolve } from "path";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
	plugins: [react(), tailwindcss()],
	build: {
		outDir: "dist",
		rollupOptions: {
			input: {
				popup: resolve(__dirname, "src/popup/popup.html"),
				background: resolve(__dirname, "src/background.ts"),
				content: resolve(__dirname, "src/content.tsx"),
			},
			output: {
				entryFileNames: (chunk) => {
					if (chunk.name === "content") return "scripts/content.js";
					if (chunk.name === "background") return "background.js";
					return "[name]/[name].js";
				},
				chunkFileNames: "[name].js",
				assetFileNames: (asset) => {
					if (asset.name?.startsWith("content")) return "content.css";
					return "[name].[ext]";
				},
			},
		},

		cssCodeSplit: true,
	},
});
