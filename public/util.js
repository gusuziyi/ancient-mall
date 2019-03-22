const trimCity = (city) => city.replace(
	/(藏族|蒙古族|傣族|回族|苗族|傈僳族|黎族|土家族|蒙古|哈萨克|柯尔克孜|景颇族|白族|彝族|哈尼族|壮族|羌族|布依族|侗族|朝鲜族)*(自治州|地区|盟|自治县|县|林区|市)?$/g, '')

const removeRepeat_Goods = (oldArr) => {
	if (!oldArr.length)
		return new Error("removeRepeat_Goods's oldArr is empty!")
	let newArr = []
	for (let i = 0; i < oldArr.length; i++) {
		let isRepeat = false
		for (let j = 0; j < newArr.length; j++) {
			if (oldArr[i].cid == newArr[j].cid) {
				isRepeat = true
			}
		}
		if (!isRepeat) {
			newArr.push(oldArr[i])
		}
	}
	return newArr
}

const getDistance = (lng1, lat1, lng2, lat2) => {
	let radLat1 = lat1 * Math.PI / 180.0;
	let radLat2 = lat2 * Math.PI / 180.0;
	let a = radLat1 - radLat2;
	let b = lng1 * Math.PI / 180.0 - lng2 * Math.PI / 180.0;
	let s = 2 * Math.asin(Math.sqrt(Math.pow(Math.sin(a / 2), 2) + Math.cos(radLat1) * Math.cos(radLat2) * Math.pow(Math.sin(
		b / 2), 2)));
	s = s * 6378.137; // EARTH_RADIUS;
	s = Math.round(s * 10000) / 10000;
	return s;
}

export default {
	removeRepeat_Goods,
	trimCity,
	getDistance,
}
