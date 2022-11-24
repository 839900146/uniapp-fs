// @ts-nocheck
import { App } from 'vue'
import fs from './fs'
export default {
	install(app: App) {
		if(app.config?.globalProperties) {
			app.config.globalProperties.$fs = fs
		} else {
			app.prototype.$fs = fs
		}
	},
}
