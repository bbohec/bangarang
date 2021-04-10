import path from 'path';
import resolve from '@rollup/plugin-node-resolve';
import replace from '@rollup/plugin-replace';
import commonjs from '@rollup/plugin-commonjs';
import url from '@rollup/plugin-url';
import svelte from 'rollup-plugin-svelte';
import babel from '@rollup/plugin-babel';
import { terser } from 'rollup-plugin-terser';
import sveltePreprocess from 'svelte-preprocess';
import typescript from '@rollup/plugin-typescript';
import sapperConfig from 'sapper/config/rollup.js';
import pkg from './package.json';
import {config} from 'dotenv'
config()
const mode = process.env.NODE_ENV;
const dev = mode === 'development';
const legacy = !!process.env.SAPPER_LEGACY_BUILD;
const onwarn = (warning, onwarn) => (warning.code === 'MISSING_EXPORT' && /'preload'/.test(warning.message)) || (warning.code === 'CIRCULAR_DEPENDENCY' && /[/\\]@sapper[/\\]/.test(warning.message)) || (warning.code === 'THIS_IS_UNDEFINED') || onwarn(warning);
export default {
	client: {
		input: sapperConfig.client.input().replace(/\.js$/, '.ts'),
		output: sapperConfig.client.output(),
		plugins: [
			replace({
				preventAssignment:true,
				values: {
					'process.browser': true,
					'process.env.NODE_ENV': JSON.stringify(mode),
					'process.env.REST_ENDPOINT_FQDN': JSON.stringify(process.env.REST_ENDPOINT_FQDN),
					'process.env.PORT': JSON.stringify(process.env.PORT),
					'process.env.REST_ENDPOINT_SHEME': JSON.stringify(process.env.REST_ENDPOINT_SHEME)
				}
			}),
			svelte({
				preprocess: sveltePreprocess({ 
					sourceMap: dev, 
					postcss: true 
				}),
				compilerOptions: {
					dev,
					hydratable: true
				}
			}),
			url({
				sourceDir: path.resolve(__dirname, 'src/node_modules/images'),
				publicPath: '/client/'
			}),
			resolve({
				browser: true,
				dedupe: ['svelte']
			}),
			commonjs(),
			typescript({ sourceMap: dev }),
			legacy && babel({
				extensions: ['.js', '.mjs', '.html', '.svelte'],
				babelHelpers: 'runtime',
				exclude: ['node_modules/@babel/**'],
				presets: [
					[
						'@babel/preset-env', 
						{targets: '> 0.25%, not dead'}
					]
				],
				plugins: [
					'@babel/plugin-syntax-dynamic-import',
					[
						'@babel/plugin-transform-runtime', 
						{useESModules: true}
					]
				]
			}),
			!dev && terser({
				module: true
			})
		],
		preserveEntrySignatures: false,
		onwarn,
	},
	server: {
		input: { server: sapperConfig.server.input().server.replace(/\.js$/, ".ts") },
		output: sapperConfig.server.output(),
		plugins: [
			typescript({ sourceMap: dev }),
			replace({
				preventAssignment:true,
				'process.browser': false,
				'process.env.NODE_ENV': JSON.stringify(mode),
				'process.env.GCP_PROJECT_ID': JSON.stringify(process.env.GCP_PROJECT_ID),
				'process.env.GCP_CLIENT_EMAIL': JSON.stringify(process.env.GCP_CLIENT_EMAIL),
				'process.env.GCP_PRIVATE_KEY': JSON.stringify(process.env.GCP_PRIVATE_KEY),
				'process.env.REST_ENDPOINT_FQDN': JSON.stringify(process.env.REST_ENDPOINT_FQDN),
				'process.env.PORT': JSON.stringify(process.env.PORT),
				'process.env.REST_ENDPOINT_SHEME': JSON.stringify(process.env.REST_ENDPOINT_SHEME)
			}),
			svelte({
				preprocess: sveltePreprocess({ sourceMap: dev, postcss: true }),
				compilerOptions: {
					dev,
					generate: 'ssr',
					hydratable: true
				},
				emitCss: false
			}),
			url({
				sourceDir: path.resolve(__dirname, 'src/node_modules/images'),
				publicPath: '/client/',
				emitFiles: false // already emitted by client build
			}),
			resolve({
				dedupe: ['svelte']
			}),
			commonjs(),
			
		],
		external: Object.keys(pkg.dependencies).concat(require('module').builtinModules),

		preserveEntrySignatures: 'strict',
		onwarn,
	},
	serviceworker: {
		input: sapperConfig.serviceworker.input().replace(/\.js$/, '.ts'),
		output: sapperConfig.serviceworker.output(),
		plugins: [
			resolve(),
			replace({
				preventAssignment:true,
				'process.browser': true,
				'process.env.NODE_ENV': JSON.stringify(mode)
			}),
			commonjs(),
			typescript({ sourceMap: dev }),
			!dev && terser()
		],
		preserveEntrySignatures: false,
		onwarn,
	}
};