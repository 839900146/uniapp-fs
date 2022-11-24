// @ts-ignore
import * as SparkMD5 from 'spark-md5'

export default class WxFS {
	fs: UniApp.FileSystemManager
	// #ifdef MP-WEIXIN

	constructor() {
		this.fs = uni.getFileSystemManager()
	}

	/**
	 * 读取文件
	 */
	readFile(path: string) {
		return new Promise<{ data: string | ArrayBuffer | unknown }>((resolve) => {
			this.fs.readFile({
				filePath: path,
				success: (result) => resolve({ data: result.data }),
				fail: () => resolve({} as any),
			})
		})
	}
	/**
	 * 读取JSON文件
	 */
	readJSON(path: string) {
		return new Promise<{ data: string | ArrayBuffer } | unknown>((resolve) => {
			this.fs.readFile({
				filePath: path,
				encoding: 'utf8',
				success: (result) => {
					if (typeof result.data === 'string') {
						resolve({ data: JSON.parse(result.data as string) })
					} else {
						resolve({ data: result.data })
					}
				},
				fail: () => resolve({}),
			})
		})
	}
	/**
	 * 写入文件
	 */
	writeFile(path: string, data: any) {
		return new Promise<boolean>((resolve) => {
			this.fs.writeFile({
				filePath: path,
				data,
				success: () => resolve(true),
				fail: () => resolve(false),
			})
		})
	}
	/**
	 * 写入json
	 */
	writeJSON(path: string, data: any) {
		return this.writeFile(path, JSON.stringify(data))
	}
	/**
	 * 读取并写入
	 */
	async readAndWrite(sourcePath: string, targetPath: string) {
		let data = await this.readFile(sourcePath)
		return await this.writeFile(targetPath, data)
	}
	/**
	 * 创建文件夹
	 */
	mkdir(path: string): Promise<boolean> {
		return new Promise((resolve) => {
			this.fs.mkdir({
				dirPath: path,
				success: () => resolve(true),
				fail: () => resolve(false),
			})
		})
	}
	/**
	 * 删除文件
	 */
	unlink(path: string): Promise<boolean> {
		return new Promise((resolve) => {
			this.fs.unlink({
				filePath: path,
				success: () => resolve(true),
				fail: () => resolve(false),
			})
		})
	}
	/**
	 * 删除目录
	 */
	rmdir(path: string): Promise<boolean> {
		return new Promise((resolve) => {
			this.fs.rmdir({
				dirPath: path,
				recursive: true,
				success: () => resolve(true),
				fail: () => resolve(false),
			})
		})
	}
	/**
	 * 如果目录不存在则自动创建
	 */
	async ensure(path: string) {
		const flag = await this.access(path)
		if (!flag) this.mkdir(path)
	}
	/**
	 * 判断文件/文件夹是否存在
	 */
	access(path: string) {
		return new Promise((resolve) => {
			this.fs.access({
				path,
				success: () => resolve(true),
				fail: () => resolve(false),
			})
		})
	}
	/**
	 * 读取文件夹
	 */
	readdir(path: string): { data: string[] } | unknown {
		return new Promise((resolve) => {
			this.fs.readdir({
				dirPath: path,
				success: (files) => resolve({ data: files }),
				fail: () => resolve({}),
			})
		})
	}
	/**
	 * 读取文件信息
	 * @param type 要读取的文件类型
	 */
	async readFileInfo(path: string, type: 'file'): Promise<UniApp.Stats>
	async readFileInfo(path: string, type: 'image'): Promise<UniApp.GetImageInfoSuccessData>
	async readFileInfo(path: string, type: 'video'): Promise<any>
	async readFileInfo(path: string, type: 'file' | 'video' | 'image') {
		return new Promise((resolve) => {
			if (type === 'file') {
				this.fs.stat({
					path,
					success: (result) => resolve({ data: result.stats }),
					fail: () => resolve({}),
				})
			}

			if (type === 'image') {
				uni.getImageInfo({
					src: path,
					success: (result) => resolve({ data: result }),
					fail: () => resolve({}),
				})
			}

			if (type === 'video') {
				uni.getVideoInfo({
					src: path,
					success: (result) => resolve({ data: result }),
					fail: () => resolve({}),
				})
			}
		})
	}
	/**
	 * 读取文件哈希
	 */
	async readFileToHash(path: string): Promise<string> {
		console.log('path', path)
		let result = await this.readFile(path)
		let spark = new SparkMD5.ArrayBuffer()
		spark.append(result.data as ArrayBuffer)
		return spark.end()
	}
	// #endif
}
