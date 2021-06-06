import { app, Menu, ipcMain, BrowserWindow} from 'electron'
import { initSetting, readSetting, writeSetting } from './setting'
import * as Sentry from '@sentry/electron'
import Screenshots from 'electron-screenshots'
/**
 * 崩溃报告
 */
Sentry.init({
  dsn: 'https://63fd311869974925bcf1bdeaa1af2b79@o260436.ingest.sentry.io/1457235',
  debug: false,
  sampleRate: 1,
  maxBreadcrumbs: 100,
  attachStacktrace: true
})

export default class IDE {

  // 托盘图标
  $tray = null
  // 主窗口
  $mainWin = null
  // 默认配置
  setting = {
    autoupdate: true,
    enableCapture: true,
    enableFlicker: true,
    keymap: {
      'screenshots-capture': ['Control', 'Alt', 'A']
    }
  }
  constructor() {
    if (!app.requestSingleInstanceLock()) return app.quit()
    this.init().then(()=>{
      app.setAppUserModelId('com.mychip.ide')
      // 移除窗口菜单
      Menu.setApplicationMenu(null)
      this.initMainWin()
      this.initScreenshots()
    })
  }

  /**
   * 应用初始化
   * @return {Promise}
   */
  async init() {
    console.log(process.platform)
    this.setting = await initSetting(this)()
    // 重复打开应用就显示窗口
    app.on('second-instance', (event, commandLine, workingDirectory) => this.showMainWin())
    // 所有窗口关闭之后退出应用
    app.once('window-all-closed', () => {
      if (process.platform !== 'darwin') {
        if (this.$tray && !this.$tray.isDestroyed()) {
          this.$tray.destroy()
          this.$tray = null
        }
        app.quit()
      }
    })

    return app.whenReady()
  }

  /**
 * 显示主窗口
 */
  showMainWin() {
    if (this.$mainWin) {
      if (this.$mainWin.isMinimized()) this.$mainWin.restore()
      this.$mainWin.show()
      this.$mainWin.focus()
    }
  }
}
