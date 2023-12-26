import {Component, ElementRef, OnInit, ViewChild} from "@angular/core";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {ActivatedRoute} from "@angular/router";

import {Query} from "../../../model";
import {CommonService} from "../../../service/common/common.service";
import {FirmwareService} from "../../../service/product/firmware.service";
import {MsgService} from "../../../service/msg/msg.service";

class FirmwareQuery extends Query {
	deviceId: '';
}

@Component({
	selector: 'product-firmware',
	templateUrl: './firmware.component.html',
	styleUrls: ['./firmware.component.scss']
})
export class FirmwareComponent implements OnInit{
	public title = '';

	private id: number ;

	private category: number

	public tableData: any[] = []

	public query = new FirmwareQuery()

	public total = 0 ;

	public loading = false ;
	constructor(
		private readonly route: ActivatedRoute ,
		private readonly service: FirmwareService,
		private readonly fb: FormBuilder,
		private readonly commonService: CommonService,
		private readonly msg: MsgService
	) {
	}

	public form: FormGroup = this.fb.group({
		id: [],
		deviceId: ['', [ Validators.required] ] ,
		version: ['', [Validators.required] ],
		path: ['', [Validators.required]],
		size: [''],
		descZh: [''],
		descEn: [''],
		category: [''],
	})

	ngOnInit() {
		this.route.queryParams.subscribe( (r: any) => {
			this.id = r.id
			this.category = r.category
			this.title = r.name
			this.query.deviceId  = r.id ;
			this.form.patchValue({
				deviceId: r.id,
				category: r.category
			})
			this.getList()
		})
	}

	public pageChange($event: number, type: string) {
		if (type === 'size') this.query.pageSize = $event
		if (type === 'number') this.query.pageNumber = $event
		this.getList()
	}

	public getList() {
		this.service.list({data: this.query})
			.subscribe( (r: any) => {
				this.tableData = r.data.result;
				this.total = r.data.total
			})
	}

	public modal = false
	public add () {
		this.modal = true
		this.form.reset()
		this.form.patchValue({
			deviceId: this.id,
			category: this.category
		})
		if( this.inputEle.nativeElement )
			this.inputEle.nativeElement.value = '' ;
	}


	@ViewChild('inputEle') inputEle: ElementRef

	public selectInput () {
		this.inputEle.nativeElement.click()
	}

	public firmware: File
	public firmwareName: string
	public inputFileChange($event: Event){
		const tar = $event.target as HTMLInputElement ;
		const files = tar.files as FileList
		if( files.length ) {
			this.firmware = files[0]
			this.firmwareName =this.firmware.name
			this.form.patchValue({
				path: this.firmware,
				size: Number(this.firmware.size / 1024).toFixed(2)
			})
		}
	}

	public edit (data: any) {
		this.form.patchValue({
			id: data.id ,
			deviceId: data.deviceId ,
			path: data.path,
			size: data.size ,
			version: data.version
		})
		this.firmwareName = data.path
		try {
			 const json = JSON.parse(data.desc) ;
			 this.form.patchValue({
				 descZh: json['zh-CN'],
				 descEn: json['en-US']
			 })
		} catch (e) {

		}
		this.modal = true
	}
	public confirm () {
		const val = this.form.value;
		const submit = (s = '') => {
			const v = this.form.value
			const data = {...v, path: s, desc: JSON.stringify({
					'zh-CN': v.descZh,
					'en-US': v.descEn,
				})}
			const success = () => {
				this.modal = false
				this.msg.success('操作成功')
				this.getList()
			}
			if (data.id) {
				this.service.update({data})
					.subscribe(() => success())
			} else {
				this.service.add({data})
					.subscribe(() => success())
			}
		}
		if (val.path instanceof File) {
			const data = new FormData()
			data.append('file', val.path)
			this.commonService.uploadBin({data, param: {folder: val.category}})
				.subscribe((r: any) => submit(r.data))
		} else {
			submit(val.path)
		}
	}

	public del(data: any) {
		this.service.delete({
			variable: {id: data.id}
		}).subscribe(() => {
			this.msg.success('操作成功')
			this.getList()
		})
	}
}
