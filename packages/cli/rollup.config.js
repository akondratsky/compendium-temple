module.exports = (config) => {
  return {
    ...config,
    onwarn(warning, warn) {
      // https://github.com/rollup/rollup/issues/1518#issuecomment-321875784
      if (warning.code === 'THIS_IS_UNDEFINED') return;
      warn(warning);
    }
  };
};
