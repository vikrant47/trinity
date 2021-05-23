const plugins = [
  '@vue/babel-plugin-transform-vue-jsx',
  ['@babel/plugin-transform-runtime',
    {
      // "absoluteRuntime": false,
      'corejs': false,
      // "helpers": true,
      'regenerator': true
      // "useESModules": false
    }
  ],
  '@babel/plugin-proposal-class-properties'
];
// Remove the console from the production environment
if (process.env.NODE_ENV === 'production') {
  plugins.push('transform-remove-console');
}
module.exports = {
  plugins: plugins,
  presets: [
    '@vue/app',
    '@babel/preset-env',
    '@babel/preset-react',
  ]
};
