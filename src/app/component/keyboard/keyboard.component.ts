import {Component, EventEmitter, Input, Output} from "@angular/core";
import {CSSVarObject, GLOBAL_CONFIG} from "../../config";
import {ImgCacheService} from "../../service/storage/img-cache.service";
export const GetScale = () => parseFloat(getComputedStyle(document.body).fontSize) / 9
export const imageEl2Base64 = (img: HTMLImageElement): string => {
	const canvas = document.createElement('canvas');
	const ctx = canvas.getContext('2d');
	canvas.height = img.height
	canvas.width = img.width;
	ctx.drawImage(img, 0, 0);
	return canvas.toDataURL("image/png")
}

@Component({
	selector: "keyboard" ,
	templateUrl: './keyboard.component.html',
	styleUrls: ['./keyboard.component.scss']
})
export class KeyboardComponent {
	private _json: Record<string, any> ;

	constructor(
		private img: ImgCacheService
	) {
	}
	@Input()
	public set json (v: Record<string, any>) {
		this._json = v ;
		if( v ) {
			try {
				const w = v.layouts.width
					* CSSVarObject.keyXPos
				const h = v.layouts.height
					* CSSVarObject.keyYPos

				this.caseStyle = {
					width: w + 'px',
					height: h  + 'px',
					position: 'relative'
				}

				this.keys = v.layouts.keys
				this.loadImg()
			} catch (e) {
				this.error.next(null)
			}
		}
	}

	@Output() press: EventEmitter<number> = new EventEmitter()
	@Output() load: EventEmitter<boolean> = new EventEmitter()
	@Output() error: EventEmitter<null> = new EventEmitter()

	public keys: any[] = []

	public get json () {
		return this._json ;
	}

	public caseStyle: Record<string, any> = {}
	static getKeyCover(conf: any) {
		const u = conf.w > 3 ? 'space' : conf.w > 1.5 ? 'enter' : 'keycap'
		const s = conf.w2 ? 'en' : u;
		const f = conf.ei !== undefined ? 'rotate' : s;
		return conf.bg ? GLOBAL_CONFIG.STATIC + conf.bg : `/assets/keyboard/${f}.png`;
	}

	public loading = false

	public containerBg = '#4f4f4f'
	public loadImg() {
		this.loading = true
		this.load.next(this.loading)
		const dest = this.json
		const arr: Array<string> = [];
		if (dest.style && dest.style.bg) {
			arr.push(GLOBAL_CONFIG.STATIC + dest.style.bg)
		}
		dest.layouts.keys.forEach((i: any) => arr.push(KeyboardComponent.getKeyCover(i)))
		this.img.load('keyboard', arr)
			.subscribe(r => {
				this.loading = false
				this.load.next(this.loading)
				if (dest.style && dest.style.bg) {
					const el = this.img.get('keyboard', GLOBAL_CONFIG.STATIC + dest.style.bg)
					this.containerBg = `url(${imageEl2Base64(el)}) round`
				} else {
					this.containerBg = '#4f4f4f'
				}
				this.calcKeycapStyle()
			})
	}

	public keycapStlye: any[] = []
	public calcKeycapStyle () {
		this.keys.forEach( conf => {
			const el = this.img.get('keyboard', KeyboardComponent.getKeyCover(conf))
			const pos = this.calculatePointPosition(conf);
			const w = CSSVarObject.keyWidth
			const h = CSSVarObject.keyHeight
			const ww = conf.w2 ? Math.max(conf.w2, conf.w) : conf.w;
			const hh = conf.h2 ? Math.max(conf.h2, conf.h) : conf.h;
			const xx = conf.x2 ? conf.x2 + conf.x : conf.x;
			const yy = conf.y2 ? conf.y2 + conf.y : conf.y;

			const px = pos[0] - CSSVarObject.keyWidth / 2;
			const py = pos[1] - CSSVarObject.keyHeight / 2;

			const translateX = CSSVarObject.keyWidth / 2 +
				px -
				(CSSVarObject.keyXPos * ww - CSSVarObject.keyXSpacing) / 2
			const translateY = CSSVarObject.keyHeight / 2 +
				py -
				(CSSVarObject.keyYPos * hh - CSSVarObject.keyYSpacing) / 2
			const rad = (conf.r * (2 * Math.PI)) / 360;

			this.keycapStlye.push({
				style:  {
					width: (ww * CSSVarObject.keyXPos - CSSVarObject.keyXSpacing) + 'px',
					height: (hh * CSSVarObject.keyYPos - CSSVarObject.keyYSpacing) + 'px',
					transform: `translate(${translateX}px , ${translateY}px) rotate(${rad}rad)`
				},
				bg:  {
					background: `url(${imageEl2Base64(el)}) round`
				}
			})
		})
	}

	private calculatePointPosition({
		                               x = 0,
		                               x2 = 0,
		                               y = 0,
		                               r = 0,
		                               rx = 0,
		                               ry = 0,
		                               w = 0,
		                               w2 = 0,
		                               h = 0,
	                               }: any) {
		const rRadian = (r * (2 * Math.PI)) / 360;
		const cosR = Math.cos(rRadian);
		const sinR = Math.sin(rRadian);
		const originX = CSSVarObject.keyXPos * rx;
		const originY = CSSVarObject.keyYPos * ry;
		const xPos =
			CSSVarObject.keyXPos * (x + x2) +
			(Math.max(w2, w) * CSSVarObject.keyWidth) / 2 +
			((Math.max(w2, w) - 1) * CSSVarObject.keyXSpacing) / 2;
		const yPos =
			CSSVarObject.keyYPos * y +
			(h * CSSVarObject.keyHeight) / 2 +
			((h - 1) * CSSVarObject.keyYSpacing) / 2;
		const transformedXPos =
			xPos * cosR - yPos * sinR - originX * cosR + originY * sinR + originX;
		const transformedYPos =
			xPos * sinR + yPos * cosR - originX * sinR - originY * cosR + originY;
		return [transformedXPos, transformedYPos];
	}

	public pressKey(idx: number) {
		this.press.next(idx)
	}

	public setCase(img: string) {
		this.containerBg = `url(${img}) round` ;
	}

	public setKeyCap(i:number, img: string) {
		this.keycapStlye[i].bg = {
			background: `url(${img}) round`
		}
	}
}
