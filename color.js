// region 辅助函数
// RGB2XYZ空间的系数矩阵
var M = nj.array([
	[0.412453, 0.357580, 0.180423],
	[0.212671, 0.715160, 0.072169],
	[0.019334, 0.119193, 0.950227]])

// im_channel取值范围：[0,1]
function f(im_channel) {
	return im_channel > 0.008856 ? Math.pow(im_channel, 1 / 3) : 7.787 * im_channel + 0.137931
}

function anti_f(im_channel) {
	return im_channel > 0.206893 ? Math.pow(im_channel, 3) : (im_channel - 0.137931) / 7.787
}

function __rgb2xyz__(rgb) {
	rgb = nj.array(rgb)
	var XYZ = nj.dot(M, rgb.T)
	XYZ = [XYZ.get(0) / 255.0, XYZ.get(1) / 255.0, XYZ.get(2) / 255.0]
	return [XYZ[0] / 0.95047, XYZ[1] / 1.0, XYZ[2] / 1.08883]
}

function __xyz2lab__(xyz) {
	var F_XYZ = [f(xyz[0]), f(xyz[1]), f(xyz[2])]
	L = xyz[1] > 0.008856 ? 116 * F_XYZ[1] - 16 : 903.3 * xyz[1]
	a = 500 * (F_XYZ[0] - F_XYZ[1])
	b = 200 * (F_XYZ[1] - F_XYZ[2])
	return [L, a, b]
}

function RGB2Lab(pixel) {
	var xyz = __rgb2xyz__(pixel)
	var Lab = __xyz2lab__(xyz)
	return Lab
}

function __lab2xyz__(Lab) {
	var fY = (Lab[0] + 16.0) / 116.0
	var fX = Lab[1] / 500.0 + fY
	var fZ = fY - Lab[2] / 200.0

	var x = anti_f(fX)
	var y = anti_f(fY)
	var z = anti_f(fZ)

	x *= 0.95047
	y *= 1.0
	z *= 1.0883

	return [x, y, z]
}

function __xyz2rgb__(xyz) {
	xyz = nj.array(xyz)
	xyz = [xyz.get(0)*255, xyz.get(1)*255, xyz.get(2)*255]
	var rgb = nj.dot(nj.inv(M), xyz.T)
	rgb = nj.uint8(nj.clip(rgb, 0, 255))
	return rgb
}

function Lab2RGB(Lab) {
	var xyz = __lab2xyz__(Lab)
	var rgb = __xyz2rgb__(xyz)
	return rgb
}
