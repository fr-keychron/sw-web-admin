import {Component, OnInit, ViewChild} from "@angular/core";
import {ActivatedRoute} from "@angular/router";
import {ProductService} from "../../../service/product/product.service";
import {HttpClient} from "@angular/common/http";
import {GLOBAL_CONFIG} from "../../../config";
import {Observable, zip} from "rxjs";
import {CommonService} from "../../../service/common/common.service";
import {ImgCacheService} from "../../../service/storage/img-cache.service";
import {imageEl2Base64, KeyboardComponent} from "../../../component/keyboard/keyboard.component";
import {MsgService} from "../../../service/msg/msg.service";
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
		private readonly common: CommonService ,
		private readonly img : ImgCacheService ,
		private readonly msg: MsgService
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
			this.product = r.data.product
			this.param.category = p.category
			this.param.product = p.id;
			this.loadJson(p.dest)
		})
	}


	public currentVersion = 'v3';

	public jsonData: Record<string, any>;

	private loadJson(defaultVal:boolean) {
		this.loading = true
		const dest = !defaultVal ? 'destination' : 'destination_custom'
		const path = GLOBAL_CONFIG.STATIC + `${dest}/${this.currentVersion}/${this.vpid}.json`;
		const success = (r: any) => {
			this.jsonData = r;
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
		debugger
		if (this.currentVersion === v) return
		this.bgSrc = ''
		this.keySrc = ''
		this.fileObj = {
			bg: null,
			keys: {}
		}
		this.currentVersion = v;
		this.loadJson(this.product.dest)
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
		this.keyboardComponent.setCase(u)

	}

	public editKeyIndex: number

	public press($event: number) {
		this.editKeyIndex = $event
		const conf = this.jsonData.layouts.keys[$event]
		if (conf.bg) {
			this.keySrc = imageEl2Base64(this.img.get('keyboard',KeyboardComponent.getKeyCover(conf)))
		} else {
			this.keySrc = '' ;
		}
	}

	public load ($e: boolean ) {
		this.loading = $e;
		if(!$e && this.jsonData.style) {
			const conf = this.jsonData.style.bg ;
			const file = this.img.get('keyboard', GLOBAL_CONFIG.STATIC + conf)
			this.bgSrc = imageEl2Base64(file)
		}
	}


	public loadError () {
		this.jsonData = null
		this.loading = false
		this.jsonFile = null
		this.msg.error('配置加载异常')
	}
	public setKey(u: string) {
		this.keySrc = u
		this.keyboardComponent.setKeyCap(this.editKeyIndex, u)
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

	@ViewChild('keyboardComponent') keyboardComponent: KeyboardComponent


	public jsonFile: File
	public jsonLoad ($event: Event) {
		const target = $event.target as HTMLInputElement ;
		const files = target.files;
		if( !files.length ) return ;
		const  fr = new FileReader()
		fr.onload = (e) => {
			const data = e.target.result as string
			try {
				this.jsonData = JSON.parse(data)
				this.jsonFile = files[0]
			} catch (e) {
				this.loadError()
			}
		}
		fr.readAsText(files[0])
	}
}
