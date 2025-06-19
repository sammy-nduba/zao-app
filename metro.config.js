const { getDefaultConfig } = require('expo/metro-config');

const config = getDefaultConfig(__dirname);

config.resolver.sourceExts.push('jsx', 'js', 'ts', 'tsx', 'cjs', 'mjs');
config.resolver.assetExts.push('png', 'jpg', 'jpeg', 'svg', 'gif');

config.transformer.assetPlugins = ['expo-asset/tools/hashAssetFiles'];
config.transformer.babelTransformerPath = require.resolve('react-native-svg-transformer');

config.transformer.getTransformOptions = async () => ({
  transform: {
    experimentalImportSupport: false,
    inlineRequires: true,
  },
});

module.exports = config;
