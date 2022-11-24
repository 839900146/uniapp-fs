/**
 * 下载文件
 * @param url 网络地址
 * @returns 临时文件地址
 */
export const downloadFile = async (url: string): Promise<string | false> => {
	return new Promise((resolve, reject) => {
		uni.downloadFile({
			url,
			success: (result) => {
				resolve(result.tempFilePath)
			},
			fail: () => reject(false),
		})
	})
}
