const linkAssets = require('@react-native-community/cli-link-assets');

module.exports = {
  project: {
    android: {},
    ios: {},
  },
  assets: ['./src/assets/Work_Sans/static'],
  commands: [linkAssets.commands.linkAssets],
};
