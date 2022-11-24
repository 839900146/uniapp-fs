import type { FsType } from './index'
// #ifdef H5
import H5 from './core/h5'
// #endif

// #ifdef APP-PLUS
import AppFS from './core/app'
// #endif

// #ifdef MP-WEIXIN
import WxFS from './core/wx'
// #endif

class FS {
	envType!: FsType.TEnvType
	// #ifdef H5
	h5: H5
	// #endif

	// #ifdef APP-PLUS
	app: AppFS
	// #endif

	// #ifdef MP-WEIXIN
	wx: WxFS
	// #endif

	constructor() {
		this.init()
		// #ifdef H5
		this.h5 = new H5()
		// #endif

		// #ifdef APP-PLUS
		this.app = new AppFS()
		// #endif

		// #ifdef MP-WEIXIN
		this.wx = new WxFS()
		// #endif
	}

	/**
	 * 初始化
	 */
	init() {
		// #ifdef MP-WEIXIN
		this.envType = 'wx'
		// #endif

		// #ifdef APP-PLUS
		this.envType = 'app'
		// #endif

		// #ifdef H5
		this.envType = 'h5'
		// #endif
	}

	get excture() {
		return this[this.envType]
	}
}

export default new FS().excture
