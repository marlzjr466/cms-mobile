module.exports = function(api) {
  api.cache(true)

  return {
    presets: ['babel-preset-expo'],
    plugins: [
      [
        'module-resolver',
        {
          extensions: ['.ios.js', '.android.js', '.ios.jsx', '.android.jsx', '.js', '.jsx', '.json', '.ts', '.tsx'],
          root: ['.'],
          alias: {
            '@modules': './src/modules',
            '@hooks': './src/hooks',
            '@assets': './src/assets',
            '@stacks': './src/stacks',
            '@screens': './src/screens',
            '@stores': './src/stores',
            '@modals': './src/modals',
            '@package': './src/package',
            '@components': './src/components',
            '@constants': './src/constants',
          },
        },
      ]
    ]
  }
}
