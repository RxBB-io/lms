import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import path from 'path'
import frappeui from 'frappe-ui/vite'

// https://vitejs.dev/config/
export default defineConfig({
	plugins: [
		frappeui({
			frappeProxy: true,
			lucideIcons: true,
			jinjaBootData: true,
			frappeTypes: {
				input: {},
			},
			buildConfig: {
				indexHtmlPath: '../lms/www/lms.html',
			},
		}),
		vue({
			script: {
				defineModel: true,
				propsDestructure: true,
			},
		}),
	],
	server: {
		allowedHosts: ['fs', 'per2'],
	},
	resolve: {
		alias: {
			'@': path.resolve(__dirname, 'src'),
			'tailwind.config.js': path.resolve(__dirname, 'tailwind.config.js'),
		},
	},
	optimizeDeps: {
		include: [
			'feather-icons',
			'showdown',
			'engine.io-client',
			'tailwind.config.js',
			'highlight.js',
			'plyr',
		],
	},
	build: {
		// Optimize build performance and reduce memory usage
		chunkSizeWarningLimit: 1000,
		rollupOptions: {
			output: {
				// Create separate chunks for large dependencies
				manualChunks: {
					'editorjs': [
						'@editorjs/editorjs',
						'@editorjs/header',
						'@editorjs/paragraph',
						'@editorjs/checklist',
						'@editorjs/code',
						'@editorjs/embed',
						'@editorjs/table',
						'@editorjs/nested-list',
						'@editorjs/simple-image',
						'@editorjs/inline-code'
					],
					'charts': [
						'chart.js',
						'apexcharts',
						'vue-chartjs',
						'vue3-apexcharts'
					],
					'codemirror': [
						'codemirror',
						'vue-codemirror',
						'@codemirror/lang-html',
						'@codemirror/lang-javascript',
						'@codemirror/lang-json',
						'@codemirror/lang-python',
						'thememirror'
					],
					'frappe-ui': ['frappe-ui'],
					'vue-vendor': ['vue', 'vue-router', 'pinia']
				}
			}
		},
		// Disable source maps in production to save memory
		sourcemap: false,
		// Reduce memory usage during minification
		terserOptions: {
			compress: {
				drop_console: true,
				drop_debugger: true,
			},
		},
	},
})
