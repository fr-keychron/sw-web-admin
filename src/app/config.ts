// const host = 'http://localhost:4001/'
const host = 'http://47.254.44.78:4001/'
const gap = 2

export const GetScale = () => parseFloat(getComputedStyle(document.body).fontSize) / 9
export const GLOBAL_CONFIG = {
	HOST: host + "api/",
	STATIC:host + "api/",
	KeyboardLayout: {
		width: 46 + gap,
		height: 48 + gap,
		gap: gap
	},
}

export const CSSVarObject = {
	keyWidth: 52 * GetScale(),
	keyXSpacing: 2 * GetScale(),
	keyHeight: 54 * GetScale(),
	keyYSpacing: 2 * GetScale(),
	keyXPos: (52 + 2) * GetScale(),
	keyYPos: (54 + 2) * GetScale(),
	faceXPadding: [6, 6],
	faceYPadding: [2, 10],
	insideBorder: 10,
};
