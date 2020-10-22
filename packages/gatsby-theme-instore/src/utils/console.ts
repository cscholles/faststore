import once from 'lodash/once'

export const showInfoInConsole = once(function ({
  platform,
  nativeVersion,
  accountName,
  spaVersion,
}: {
  platform: string
  nativeVersion: string
  accountName: string
  spaVersion: string
}) {
  if (process.env.NODE_ENV !== 'development') {
    const nativeAppInfo =
      (platform &&
        nativeVersion &&
        `${platform.toUpperCase()} - v${nativeVersion}`) ||
      ''
    console.log(`
=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-==-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-==-=-=-=-=-=-=-=
 __         _________ __
|__| ____  /   _____//  |_  ___________   ____
|  |/    \\ \\_____  \\\\   __\\/  _ \\_  __ \\_/ __ \\
|  |   |  \\/        \\|  | (  <_> )  | \\/\\  ___/
|__|___|  /_______  /|__|  \\____/|__|    \\___

  ${nativeAppInfo} ✨ ${accountName} - v${spaVersion}
=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-==-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-==-=-=-=-=-=-=-=
      `)
  }
})
