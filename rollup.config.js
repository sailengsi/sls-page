import buble from 'rollup-plugin-buble';

export default {
	entry: 'src/index.js',
	plugins: [buble()],
	treeshake: true,
	targets: [{
			dest: 'dist/sls-page.js',
			format: 'umd'
		}
		/*,{
				dest: 'dist/index.cjs.js',
			},  {
				format: 'cjs'
				dest: 'dist/index.es.js',
				format: 'es'
			}, {
				dest: 'dist/index.amd.js',
				format: 'amd'
			}, {
				dest: 'dist/index.iife.js',
				format: 'iife'
			}*/
	]
};