import {Component, ElementRef, OnInit, ViewChild} from "@angular/core";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {Router} from "@angular/router";

import {GLOBAL_CONFIG} from "../../../config";
import {Enums, Query} from '../../../model';
import {CommonService} from "../../../service/common/common.service";
import {MsgService} from "../../../service/msg/msg.service";
import {ProductService} from "../../../service/product/product.service";
import {BlobUtil} from "../../../shared/utils/blob";

class ProductQuery extends Query {

}

@Component({
	selector: 'product',
	templateUrl: './product.component.html',
	styleUrls: ['./product.component.scss']
})
export class ProductComponent implements OnInit {

	constructor(
		private readonly service: ProductService,
		private readonly commonService: CommonService,
		private readonly fb: FormBuilder,
		private readonly msg: MsgService,
		private readonly router: Router
	) {
	}

	public tableData: any[] = []
	public total = 0
	public query = new ProductQuery()

	public form: FormGroup = this.fb.group({
		id: [],
		name: ['', [Validators.required]],
		category: ['', [Validators.required]],
		vid: ['0x3434', [Validators.required]],
		pid: ['', [Validators.required]],
		vendorProductId: [{value: ''}],
		cover: [''],
		remark: ['', []]
	})

	ngOnInit() {
		this.getList()
		this.getCategory()
	}

	public vendorProductId(vendorId: number, productId: number) {
		return vendorId * 65536 + productId;
	}

	public getList() {
		this.service.productList({data: this.query})
			.subscribe((r: any) => {
				this.tableData = r.data.result;
				this.total = r.data.total
			})
	}

	public categoryEnums: Enums = [];

	public getCategory() {
		this.service.categoryAll()
			.subscribe((r: any) => {
				const {result} = r.data
				this.categoryEnums = result.map((i: any) => {
					return {label: i.name, value: i.id}
				})
			})
	}

	public pageChange($event: number, type: string) {
		if (type === 'size') this.query.pageSize = $event
		if (type === 'number') this.query.pageNumber = $event
		this.getList()
	}

	public modal = false

	public add() {
		this.form.reset({
			vid: '0x3434'
		})
		this.modal = true
	}

	public isConfirmLoading = false
	public image = ''

	@ViewChild('imageFile') imageFile!: ElementRef;

	public selectImage() {
		this.imageFile.nativeElement.click()
	}

	public confirm() {
		const val = this.form.value;
		const submit = (s = '') => {
			const v = this.form.value
			const data = {...v, cover: s}
			const success = () => {
				this.modal = false
				this.msg.success('操作成功')
				this.getList()
				this.isConfirmLoading = false
			}
			if (data.id) {
				this.service.productUpdate({data})
					.subscribe(() => success())
			} else {
				this.service.productAdd({data})
					.subscribe(() => success())
			}
		}
		this.isConfirmLoading = true
		if (val.cover instanceof File) {
			const data = new FormData()
			data.append('file', val.cover)
			this.commonService.uploadCover({data, param:{ folder: val.category }})
				.subscribe((r: any) => submit(r.data))
		} else {
			submit(val.cover)
		}
	}

	public inputFileChange($event: Event) {
		const el = $event.target as HTMLInputElement;
		const files = el.files || [];
		if (!files.length) return
		const file = files[0]
		BlobUtil.toDataUri(file)
			.subscribe(s => this.image = s)
		this.form.patchValue({cover: file})
	}

	public del(data: any) {
		this.service.productDel({
			variable: {id: data.id}
		}).subscribe(() => {
			this.msg.success('操作成功')
			this.getList()
		})
	}

	public edit(data: any) {
		this.form.patchValue(data)
		this.calcVpId()
		this.modal = true
		if (data.cover) this.image = GLOBAL_CONFIG.HOST + data.cover
	}

	public calcVpId() {
		const {vid, pid} = this.form.value
		if (vid && pid) {
			const vendorProductId = this.vendorProductId(Number(vid), Number(pid))
			this.form.patchValue({vendorProductId})
		}
	}

	public layout(data: any) {
		this.router.navigate([`merchandise/product/${data.id}/layout`])
	}

	public firmware(data: any) {
		this.router.navigate([`merchandise/product/${data.id}/firmware`], {
			queryParams: {
				name: data.name , id: data.id , category: data.category
			}
		})
	}
}
