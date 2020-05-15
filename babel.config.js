module.exports = function (api) {
  api.cache(true)

  const presetOptions = {}

  if (process.env.NODE_ENV === 'test') {
    presetOptions.targets = { node: true }
  }

  return {
    presets: [['@babel/preset-env', presetOptions], '@babel/preset-react'],
  }
}
