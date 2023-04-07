/* eslint-disable @typescript-eslint/no-var-requires */
import resolve from "@rollup/plugin-node-resolve";
import commonjs from "@rollup/plugin-commonjs";
import babel from '@rollup/plugin-babel';


import { terser } from "rollup-plugin-terser";
import peerDepsExternal from 'rollup-plugin-peer-deps-external';
import image from '@rollup/plugin-image';
// eslint-disable-next-line no-undef
const aliasFn = require('./rollup-plugin-alias-fork');

// eslint-disable-next-line @typescript-eslint/no-var-requires, no-undef
const packageJson = require("./package.json");
const config = {
	name: 'DesignSystem',
	extensions: ['.ts', '.tsx'],
};
export default [
	{
		input: "src/index.ts",
		output: [
			{
				file: packageJson.main,
				format: "cjs",
				sourcemap: true,
			},

		],
		plugins: [
			aliasFn({ resolve: ['.ts', '.tsx', '.svg'], entries: [{ find: /^@src\//, replacement: '/src/' }] }),
			peerDepsExternal(),
			resolve({
				extensions: config.extensions,
			}),
			commonjs(),

			babel({
				extensions: config.extensions,
				include: ['src/**/*'],
				exclude: 'node_modules/**',
				presets: [
					"@babel/preset-typescript",
				],
			}),

			terser(),
			image()
		],
	},

];