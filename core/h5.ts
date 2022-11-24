// @ts-nocheck
// #ifdef H5
import SparkMD5 from 'spark-md5'
// #endif

/**
 * IndexedDB数据库
 */
class IndexDB {
	// #ifdef H5
	private dbConfig: { dbVersion: number; dbName: string };
	private db: IDBOpenDBRequest;

	constructor() {
		this.db = null as unknown as IDBOpenDBRequest
		this.dbConfig = {
			dbName: 'app_runtime_store',
			dbVersion: 2,
		}

		this.init()
	}

	private init() {
		let request = window.indexedDB.open(this.dbConfig.dbName, this.dbConfig.dbVersion)

		request.onerror = (event) => {
			console.error('数据库打开报错')
		}

		// 数据库打开成功
		request.onsuccess = (ev: any) => {
			this.db = ev.target.result
			this.bindVersion()
		}

		// 数据库版本更新
		request.onupgradeneeded = (event) => {
			this.db = event.target!.result
			this.bindVersion()
			this.createStore()
		}
	}

	/**
	 * 绑定版本号
	 */
	private bindVersion() {
		if (this.db.version !== this.dbConfig.dbVersion) {
			this.db.version = this.dbConfig.dbVersion
		}
	}

	/**
	 * 创建表（已完成）
	 */
	private createStore() {
		if (!this.db.objectStoreNames.contains('files_store')) {
			let filesStore = this.db.createObjectStore('files_store', { autoIncrement: true })
			filesStore.createIndex('fileName', 'fileName', { unique: false })
			filesStore.createIndex('fileHash', 'fileHash', { unique: true })

			this.db.createObjectStore('text_store', { autoIncrement: true })
		}
	}

	/**
	 * 添加文件（已完成）
	 */
	protected Add(tableName: string, obj: Record<string, any>) {
		return new Promise<boolean>((resolve) => {
			let request = this.db
				.transaction([tableName], 'readwrite')
				.objectStore(tableName)
				.add(obj, obj.key)
			request.onsuccess = () => resolve(true)
			request.onerror = () => resolve(false)
		})
	}

	/**
	 * 读取文件（已完成）
	 */
	protected Read(tableName: string, id: string) {
		return new Promise((resolve) => {
			let transaction = this.db.transaction([tableName], 'readwrite')
			let store = transaction.objectStore(tableName)
			let request = store.get(id)

			request.onsuccess = () => {
				if (request.result) {
					resolve(request.result)
				} else {
					resolve(null)
				}
			}

			request.onerror = () => resolve(false)
		})
	}

	/**
	 * 更新文件（已完成）
	 */
	protected Put(tableName: string, obj: Record<string, any>) {
		return new Promise<boolean>((resolve) => {
			let request = this.db
				.transaction([tableName], 'readwrite')
				.objectStore(tableName)
				.put(obj)
			request.onsuccess = () => resolve(true)
			request.onerror = () => resolve(false)
		})
	}

	/**
	 * 删除文件（已完成）
	 */
	protected Del(tableName: string, id: string) {
		return new Promise<boolean>((resolve) => {
			let request = this.db
				.transaction([tableName], 'readwrite')
				.objectStore(tableName)
				.delete(id)
			request.onsuccess = () => resolve(true)
			request.onerror = () => resolve(false)
		})
	}

	// #endif
}

export default class H5FS extends IndexDB {
	// #ifdef H5

	constructor() {
		super()
	}

	/**
	 * 读取文件（已完成）
	 */
	readFile(path: string) {
		return this.Read('files_store', path)
	}
	/**
	 * 读取JSON文件（已完成）
	 */
	readJSON(path: string) {
		return window.localStorage.getItem(`__files_store_${path}__`)
	}
	/**
	 * 写入文件（已完成）
	 */
	async writeFile(path: string, data: any) {
		return this.Add('files_store', data)
	}
	/**
	 * 写入json（已完成）
	 */
	writeJSON(path: string, data: any) {
		window.localStorage.setItem(path, JSON.stringify(`__files_store_${path}__`))
	}
	/**
	 * 读取并写入（已完成）
	 */
	async readAndWrite(sourcePath: string, targetPath: string) {
		let data = await this.Read('files_store', sourcePath)
		if (data) {
			this.Add(targetPath, data)
		}
	}
	/**
	 * 删除文件（已完成）
	 */
	unlink(path: string) {
		return this.Del('files_store', path)
	}
	/**
	 * 判断文件是否存在（已完成）
	 */
	async access(path: string) {
		let flag = await this.Read('files_store', path)
		return Boolean(flag)
	}
	/**
	 * 读取文件哈希（已完成）
	 */
	readFileToHash(file: File | string) {
		return new Promise<string>((resolve) => {
			if(typeof file === 'string') {
				let spark = new SparkMD5
				spark.append(file)
				resolve(spark.end()) 
			} else {
				let spark = new SparkMD5.ArrayBuffer()
				let fileReader = new FileReader()
				fileReader.readAsArrayBuffer(file)
				fileReader.onload = (e) => {
					spark.append(e.target?.result)
					resolve(spark.end())
				}
			}
		})
	}
	// #endif
}
