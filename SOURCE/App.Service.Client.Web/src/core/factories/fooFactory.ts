export function loadConfig(configService: ConfigService) {
  return () =>
    fetch('/config.json')
      .then(response => response.json())
      .then(runtimeConfig => configService.setConfig(runtimeConfig));
}
