// @ts-nocheck
export default class AppFS {
	// #ifdef APP-PLUS

	constructor() {}

	/**
	 * 读取文件（已完成）
	 */
	async readFile(path: string) {
		return new Promise<any>(async (resolve) => {
			let fs = await this.getFs()
			fs.root?.getFile(
				path,
				{
					create: false,
				},
				(fileEntry) => {
					fileEntry.file((file) => {
						let fileReader = new plus.io.FileReader()
						fileReader.readAsText(file, 'utf-8')
						fileReader.onload = (result) => {
							resolve(result.target.result)
						}
					})
				},
			)
		})
	}
	/**
	 * 读取JSON文件（已完成）
	 */
	async readJSON(path: string) {
		let result = await this.readFile(path)
		return JSON.parse(result)
	}
	/**
	 * 写入文件（已完成）
	 */
	async writeFile(path: string, data: any) {
		return new Promise<string>(async (resolve) => {
			let file = await this.getFileEntry(path)
			file.createWriter((writer) => {
				writer.seek(0)
				writer.write(data)
				writer.onwrite = () => {
					resolve(writer.fileName)
				}
			})
		})
	}
	/**
	 * 写入json（已完成）
	 */
	writeJSON(path: string, data: any) {
		if (typeof data === 'object' && data !== null) {
			// 正在执行写入json
			return this.writeFile(path, JSON.stringify(data))
		}
		return this.writeFile(path, data)
	}
	/**
	 * 读取并写入（已完成）
	 */
	async readAndWrite(sourcePath: string, targetPath: string) {
		let source = await this.readFile(sourcePath)
		await this.writeFile(targetPath, source)
	}
	/**
	 * 创建文件夹（已完成）
	 */
	mkdir(path: string) {
		return this.ensure(path)
	}
	/**
	 * 删除文件（已完成）
	 */
	async unlink(path: string) {
		return new Promise<boolean>(async (resolve) => {
			let file = await this.getFileEntry(path)
			file.remove(
				() => resolve(true),
				() => resolve(false),
			)
		})
	}
	/**
	 * 删除目录（已完成）
	 */
	rmdir(path: string) {
		return new Promise<boolean>(async (resolve) => {
			let dir = await this.getDirEntry(path)
			dir.removeRecursively(
				() => resolve(true),
				() => resolve(false),
			)
		})
	}
	/**
	 * 如果目录不存在则自动创建（已完成）
	 */
	async ensure(path: string) {
		let flag = await this.getDirEntry(path)
		if (flag) return true
		return false
	}

	/**
	 * 读取文件夹（已完成）
	 */
	readdir(path: string) {
		return new Promise<PlusIoDirectoryEntry>(async (resolve) => {
			let dir = await this.getDirEntry(path)
			let dirReader = dir.createReader()
			dirReader.readEntries((entries) => {
				resolve(entries)
			})
		})
	}

	/**
	 * 判断文件是否存在（已完成）
	 */
	access(path: string) {
		return new Promise<boolean>(async (resolve) => {
			let file = await this.getNormalFileInfo(path)
			resolve(Boolean(file.size && file.digest))
		})
	}

	/**
	 * 读取文件信息
	 * @param type 要读取的文件类型
	 */
	readFileInfo(path: string, type: 'file' | 'audio' | 'video' | 'image') {
		if (type === 'file') return this.getNormalFileInfo(path)
		if (type === 'audio') return this.getAudioInfo(path)
		if (type === 'video') return this.getVideoInfo(path)
		if (type === 'image') return this.getImageInfo(path)
	}

	/**
	 * 读取文件MD5哈希（已完成）
	 */
	readFileToHash(path: string) {
		return new Promise<string | undefined>(async (resolve) => {
			let info = await this.getNormalFileInfo(path)
			resolve(info.digest || undefined)
		})
	}

	/**
	 * 获取普通文件信息
	 */
	private async getNormalFileInfo(path: string) {
		return new Promise<any>((resolve) => {
			plus.io.getFileInfo({
				filePath: `_doc/${path}`,
				success: (result) => {
					resolve(result)
				},
				fail: (e) => {
					console.error(e)
					resolve({})
				},
			})
		})
	}

	/**
	 * 获取音频信息
	 */
	private getAudioInfo(path: string) {
		return new Promsie<any>((resolve) => {
			plus.io.getAudioInfo({
				filePath: `_doc/${path}`,
				success: (result) => {
					resolve(result)
				},
				fail: () => resolve(undefined),
			})
		})
	}

	/**
	 * 获取视频信息
	 */
	private getVideoInfo() {
		return new Promise((resolve) => {
			plus.io.getVideoInfo({
				filePath: `_doc/${path}`,
				success: (result) => {
					resolve(result)
				},
				fail: () => resolve(undefined),
			})
		})
	}

	private getImageInfo() {
		return new Promise((resolve) => {
			plus.io.getImageInfo({
				filePath: `_doc/${path}`,
				success: (result) => {
					resolve(result)
				},
				fail: () => resolve(undefined),
			})
		})
	}

	/**
	 * 创建、读取文件夹（已完成）
	 */
	private getDirEntry(path: string) {
		return new Promise<PlusIoDirectoryEntry>(async (resolve) => {
			let fs = await this.getFs()

			fs.root?.getDirectory(
				path,
				{
					create: true,
				},
				(dirEntry) => {
					resolve(dirEntry)
				},
			)
		})
	}

	/**
	 * 创建、获取文件（已完成）
	 */
	private async getFileEntry(fileName: string) {
		return new Promise<PlusIoFileEntry | void>((resolve) => {
			plus.io.requestFileSystem(plus.io.PRIVATE_DOC, (fs) => {
				let entry = fs.root
				if (!entry) return resolve()
				entry.getFile(
					fileName,
					{
						create: true,
					},
					(fileEntry) => {
						resolve(fileEntry)
					},
				)
			})
		})
	}

	/**
	 * 获取文件系统对象（已完成）
	 */
	private async getFs() {
		return new Promise<PlusIoFileSystem>((resolve) => {
			plus.io.requestFileSystem(plus.io.PRIVATE_DOC, (fs) => resolve(fs))
		})
	}
	// #endif
}
