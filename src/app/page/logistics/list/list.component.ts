import {Component, OnInit} from "@angular/core";
import {LogisticsService} from "../../../service/logistics/logistics.service";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {MsgService} from "../../../service/msg/msg.service";
import {Enums} from "../../../model";
import {formatMask} from "@delon/util";

@Component({
	selector: 'list',
	templateUrl: './list.component.html',
	styleUrls: ['./list.component.scss']
})
export class ListComponent implements OnInit {
	constructor(
		private readonly service: LogisticsService,
		private readonly fb: FormBuilder,
		private readonly msg: MsgService
	) {
	}

	ngOnInit() {
		this.getList()
		this.getPlats()
		this.jdProvider()
	}

	public tableData: any[] = [];

	public provider: any[] = [];

	public query = {
		pageSize: 10,
		pageNumber: 10
	}

	public plats: any[] = []
	public platEnums: any[] = []
	public shopEnums: any[] = []

	public setEnums() {
		this.platEnums = this.plats
	}

	public getPlats() {
		this.service.plats()
			.subscribe((r: any) => {
				this.plats = r.data
				this.getList()
				this.setEnums()
			})
	}

	public total = 0

	public getList() {
		this.service.list({data: this.query})
			.subscribe((r: any) => {
				this.tableData = r.data.result;
				this.total = r.data.total;
			})
	}

	public sizeChange($event: number, type: 'size' | 'index') {
		if (type === 'size') this.query.pageSize = $event
		if (type === 'index') this.query.pageNumber = $event;
		this.getList()
	}

	public modal = false

	public form: FormGroup = this.fb.group({
		plat: [null, [Validators.required]],
		shop: [null, [Validators.required]],
		provider: [null],
		file1: [null, [Validators.required]],
		file2: [null, Validators.required],
		file3: [null]
	})

	public record() {
		this.modal = true
		this.form.reset()
	}

	public loading = false

	public submit() {
		const formData = new FormData()
		const val = this.form.value;
		formData.append('order', val.file1)
		formData.append('payment', val.file2)
		if (val.plat === 'JD') {
			formData.append('ship', val.file3)
			formData.append('provider', val.provider)
		}
		formData.append('plat', val.plat)
		formData.append('shop', val.shop)
		// this.loading = true
		this.service.post({data: formData})
			.subscribe((r: any) => {
				// this.loading = false
				// this.modal = false
				this.msg.success('添加成功')
				this.getList()
			})
	}

	public file: Record<string, any> = {
		file1: '点击或者拖入文件',
		file2: '点击或者拖入文件',
		file3: '点击或者拖入文件',
	}

	public fileChange($event: Event, name: string) {
		const el = $event.target as HTMLInputElement
		const files = el.files;
		if (!files.length) return;

		const file = files[0]
		const fName = file.name.split('.')
		if (!['CSV', "XLSX", "XLS"].includes(fName[fName.length - 1].toUpperCase()))
			return this.msg.error('错误的文件格式，仅支持CVS,XLS,XLSX')
		this.form.patchValue({[name]: el.files[0]})
		this.file[name] = file.name
	}

	public platChange($event: any) {
		const plat = this.platEnums.find(i => i.value === $event);
		if (plat) this.shopEnums = plat.shops;
	}


	public jdProviderEnum: Enums = []

	public jdProvider() {
		this.service.jdProvider()
			.subscribe((r: any) => {
				this.jdProviderEnum = r.data.map((d: any, i: number) => {
					return {label: d.name, value: i}
				})
			})
	}
}
