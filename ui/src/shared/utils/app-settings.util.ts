let appSetting: any;

export function getAppSettings() {
  return appSetting;
}

export function setAppSettings(settings: any) {
  appSetting = settings;
  return appSetting;
}
