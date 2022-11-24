## 文件系统用法
基于uniapp，兼容微信小程序、H5、APP的文件系统实现，同时兼容vue2/3

### 代码示例
```vue
<template>
	<view>
		<button @click="writeTextFile()">写入文本文件</button>

		<button @click="readTextFile()">读取文本文件</button>

		<button @click="writeJSON()">写入JSON文件</button>

		<button @click="readJSON()">读取JSON文件</button>

		<button @click="readAndWrite()">读取并写入</button>

		<button @click="unlink()">删除文本文件</button>
		
		<button @click="ensure()">创建目录</button>
		
		<button @click="readdir()">读取目录</button>
		
		<button @click="rmdir()">删除目录</button>
		
		<button @click="access()">文件是否存在</button>
		
		<button @click="getFileMD5()">获取文件哈希</button>
	</view>
</template>

<script lang="ts" setup>
	import fs from '@/plugins/fs-system/fs'

	const writeTextFile = () => {
		// H5平台中，数据可以是任意类型
		fs.writeFile('demo.txt', '我是黄某666')
	}

	const readTextFile = async () => {
		let text = await fs.readFile('demo.txt')
		console.log('txt文件的内容为：', text);
	}

	const writeJSON = () => {
		fs.writeJSON('json.txt', {
			name: '张三',
			age: 14,
			list: [1, 2, 3, 4]
		})
	}

	const readJSON = async () => {
		let text = await fs.readJSON('json.txt')
		console.log('json文件的内容为：', text);
	}

	const readAndWrite = async () => {
		await fs.readAndWrite('demo.txt', 'new-demo.txt')
		let result = await fs.readFile('new-demo.txt')
		console.log('这是新文件的内容', result)
	}

	const unlink = async () => {
		let flag = await fs.unlink('demo.txt')
		if (flag) {
			console.log('demo.txt删除成功')
		} else {
			console.log('demo.txt删除失败')
		}
	}
	
	/**
	 * 也可以使用mkdir，mkdir也是基于ensure实现的
	 */
	const ensure = async () => {
		let flag = await fs.ensure('aaa/bbb/ccc')
		if (flag) {
			console.log('aaa/bbb/ccc 目录创建成功')
		} else {
			console.log('aaa/bbb/ccc 目录创建失败')
		}
	}
	
	const readdir = async () => {
		let result = await fs.readdir('aaa/bbb/ccc')
		console.log('目录内容', result)
	}
	
	const rmdir = async () => {
		 let flag = await fs.rmdir('aaa/bbb/ccc')
		 if (flag) {
		 	console.log('aaa/bbb/ccc 目录删除成功')
		 } else {
		 	console.log('aaa/bbb/ccc 目录删除失败')
		 }
	}
	
	const access = async () => {
		let flag = await fs.access('demo.txt')
		console.log('文件是否存在', flag)
	}
	
	const getFileMD5 = async () => {
		// 注意：如果是在H5平台，readFileToHash接收的参数为一个File对象
		let md5 = await fs.readFileToHash('demo.txt')
		console.log('hash', md5)
	}
</script>

```


### Vue2 代码示例

```vue
<script>
export default {
	method() {
		writeFile() {
			this.$fs.writeFile('demo.txt', '这是一段测试文字')
		}
	}
}
</script>
```


## 全部方法及兼容性
- readFile
- writeFile
- readJSON
- writeJSON
- readAndWrite
- mkdir
  - `h5`、`字节小程序` `不支持`
- readdir
  - `h5`、`字节小程序` `不支持`
- rmdir
  - `h5`、`字节小程序` `不支持`
- ensure
  - `h5`、`字节小程序` `不支持`
- unlink
- access
- readFileInfo
  - `仅APP支持`
- readFileToHash