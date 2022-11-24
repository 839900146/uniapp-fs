import fs from "./fs";

export {}

export module FsType {
	/** 当前环境 */
	type TEnvType = 'h5' | 'app' | 'wx'
}

declare module 'vue/types/vue' {
	interface Vue {
		$fs: typeof fs
	}
}