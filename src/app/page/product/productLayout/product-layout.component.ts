import {Component, OnInit} from "@angular/core";
import {ActivatedRoute} from "@angular/router";
import {ProductService} from "../../../service/product/product.service";
import {HttpClient} from "@angular/common/http";
import {GLOBAL_CONFIG} from "../../../config";
import {Observable, zip} from "rxjs";
import {CommonService} from "../../../service/common/common.service";

const GetScale = () => parseFloat(getComputedStyle(document.body).fontSize) / 9

@Component({
	selector: 'product-layout',
	templateUrl: './product-layout.component.html',
	styleUrls: ['./product-layout.component.scss']
})
export class ProductLayoutComponent implements OnInit {
	constructor(
		private readonly route: ActivatedRoute,
		private readonly service: ProductService,
		private readonly http: HttpClient,
		private readonly common: CommonService
	) {
	}

	private vpid: string;

	ngOnInit() {
		this.route.params.subscribe((r) => {
			this.vpid = r['id'];
			this.info()
		})
	}

	private product: Record<string, any>;

	private param = {
		category: '',
		product: '',
	}

	private info() {
		this.service.productInfoByVpId({
			variable: {id: this.vpid}
		}).subscribe((r: any) => {
			const p = r.data.product;
			this.param.category = p.category
			this.param.product = p.id;
			this.loadJson(p.dest)
		})
	}


	public currentVersion = 'v3';

	public jsonData: Record<string, any>;

	private loadJson(defaultVal = true) {
		this.loading = true
		const dest = !defaultVal ? 'destination' : 'destination_custom'
		const path = GLOBAL_CONFIG.STATIC + `${dest}/${this.currentVersion}/${this.vpid}.json`;
		const success = (r: any) => {
			this.jsonData = r;
			this.init()
		}

		const error = (e: any) => {
			this.jsonData = null
			this.loading = false
		}

		this.http.get(path)
			.subscribe(
				r => success(r),
				err => error(err)
			)
	}

	public setVersion(v: 'v2' | 'v3') {
		if (this.currentVersion === v) return
		this.bgSrc = ''
		this.keySrc = ''
		this.fileObj = {
			bg: null,
			keys: {}
		}
		this.keyCap = [] ;
		this.currentVersion = v;
		this.loadJson(!this.product?.dest)
	}

	public bgSrc = '';
	public keySrc = '';

	public imgInput($event: Event, type: 'bg' | 'key') {
		const el = $event.target as HTMLInputElement;
		const files = el.files;
		if (!files.length) return;
		const file = files[0]
		const fr = new FileReader()
		fr.onload = e => {
			if (type === "bg") {
				this.fileObj.bg = file;
				this.setBg(e.target.result as string)
			}

			if (type === 'key') {
				this.fileObj.keys[this.editKeyIndex] = file
				this.setKey(e.target.result as string)
			}
		}
		fr.readAsDataURL(file)
	}

	public fileObj: any = {
		bg: null,
		keys: {}
	}

	public setBg(u: string) {
		this.bgSrc = u
		this.containerStyle.parent.background = `url(${u}) round`
	}

	public editKeyIndex: number

	public press($event: number) {
		this.editKeyIndex = $event
		const conf = this.jsonData.layouts.keys[$event]
		if (conf.bg) {
			this.keySrc = this.imgCache[this.getKeyCover(conf)].b64
		} else {
			this.keySrc = '' ;
		}
	}

	public setKey(u: string) {
		this.keySrc = u
		this.keyCap[this.editKeyIndex].child.background = `url(${u}) round`
	}

	public submit() {
		const taskQueue: Array<Observable<any>> = [];
		this.loading = true
		const jsonData = JSON.parse(JSON.stringify(this.jsonData))
		if (this.fileObj.bg) {
			taskQueue.push(new Observable(s => {
				const data = new FormData()
				data.append('file', this.fileObj.bg);
				this.common.uploadKeyCover({data, param: this.param})
					.subscribe((r: any) => {
						jsonData.style = {bg: r.data}
						s.next()
					})
			}))
		}

		Object.keys(this.fileObj.keys).forEach(k => {
			const file = this.fileObj.keys[k]
			taskQueue.push(new Observable(s => {
				const data = new FormData()
				data.append('file', file);
				this.common.uploadKeyCover({data, param: this.param})
					.subscribe((r: any) => {
						jsonData.layouts.keys[this.editKeyIndex].bg = r.data
						s.next()
					})
			}))
		})

		const run = () => {
			if (taskQueue.length) {
				const ob = taskQueue.shift();
				ob.subscribe(() => run())
			} else {
				const data = {
					json: jsonData,
					vpId: this.vpid,
					version: this.currentVersion,
				}
				this.service.productUpdateJson({data}).subscribe((r: any) => {
					this.loading = false
				})
			}
		}
		run()
	}


	public loading = true

	public containerStyle: any = {
		parent: {},
		child: {}
	}

	public init() {
		this.loadImg()
	}

	public imgCache: Record<string, {
		load: boolean,
		img: HTMLImageElement,
		b64: string
	}> = {}
	public keyCap: Array<Record<string, any>> = []

	public getKeyCover(conf: any) {
		const u = conf.w > 3 ? 'space' : conf.w > 1.5 ? 'enter' : 'keycap'
		const s = conf.w2 ? 'en' : u;
		const f = conf.ei !== undefined ? 'rotate' : s;
		return conf.bg ? GLOBAL_CONFIG.STATIC + conf.bg : `/assets/keyboard/${f}.png`
	}

	public loadImg() {
		const keys = this.jsonData.layouts.keys;
		const urlArr: Array<string> = []
		if (this.jsonData.style && this.jsonData.style.bg) {
			const s = GLOBAL_CONFIG.STATIC + this.jsonData.style.bg
			urlArr.push(s);
			this.imgCache[s] = {load: false, b64: '', img: null}
		}

		keys.forEach((conf: any) => {
			const g = this.getKeyCover(conf)
			if (urlArr.findIndex(i => i === g) === -1) {
				urlArr.push(g)
				this.imgCache[g] = {load: false, b64: '', img: null}
			}
		})

		const obs = urlArr.map(u => {
			return new Observable(s => {
				const img = new Image()
				img.crossOrigin = "anonymous"
				img.onload = () => {
					this.imgCache[u].load = true
					this.imgCache[u].img = img;
					this.imgCache[u].b64 = this.imageEl2Base64(img)
					s.next()
				}
				img.src = u;
			})
		})

		zip(obs)
			.subscribe(r => {
				this.loading = false;
				this.jsonData.layouts.keys.forEach((conf: any) => {
					const {width, height, gap} = GLOBAL_CONFIG.KeyboardLayout;
					const w = width * GetScale()
					const h = height * GetScale()
					const ww = conf.w2 ? Math.max(conf.w2, conf.w) : conf.w;
					const hh = conf.h2 ? Math.max(conf.h2, conf.h) : conf.h;
					const xx = conf.x2 ? conf.x2 + conf.x : conf.x;
					const yy = conf.y2 ? conf.y2 + conf.y : conf.y
					const g = this.getKeyCover(conf)
					this.keyCap.push({
						parent: {
							width: ww * w + 'px',
							height: hh * h + 'px',
							top: yy * h + 'px',
							left: xx * w + 'px'
						},
						child: {
							background: `url(${this.imgCache[g].b64}) round`
						}
					})
				})
				const w = this.jsonData.layouts.width
					* GLOBAL_CONFIG.KeyboardLayout.width;
				const h = this.jsonData.layouts.height
					* GLOBAL_CONFIG.KeyboardLayout.height;
				const child: any = {
					width: (w * GetScale()) + 'px',
					height: (h * GetScale()) + 'px',
				}

				const parent = {
					background: 'rgb(79, 79, 79)'
				}
				if (this.jsonData.style?.bg) {
					const img = this.imgCache[GLOBAL_CONFIG.STATIC + this.jsonData.style.bg].b64
					parent.background = `url(${img}) round`;
					this.bgSrc = img
				}
				this.containerStyle = {child, parent}
			})
	}

	public imageEl2Base64(img: HTMLImageElement): string {
		const canvas = document.createElement('canvas');
		const ctx = canvas.getContext('2d');
		canvas.height = img.height
		canvas.width = img.width;
		ctx.drawImage(img, 0, 0);
		return canvas.toDataURL("image/png")
	}

	public paintWrapper = {background: '#4f4f4f'}
}
