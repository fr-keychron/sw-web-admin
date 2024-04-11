import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';

import {Query} from '../../../model';
import {MsgService} from "../../../service/msg/msg.service";
import {ProductService} from '../../../service/product/product.service';

@Component({
	selector: 'category',
	templateUrl: './category.component.html',
	styleUrls: ['./category.component.scss'],
})
export class CategoryComponent implements OnInit {
	constructor(
		private readonly service: ProductService,
		private readonly fb: FormBuilder,
		private readonly msg: MsgService
	) {
	}

	public form: FormGroup = this.fb.group({
		name: ['', [Validators.required]],
		type: ['', [Validators.required]],
		remark: [''],
		id: ['']
	})

	public modal = false;

	public add() {
		this.form.reset()
		this.modal = true;
	}

	ngOnInit() {
		this.getList()
	}

	public query = new Query();
	public tableData: any[] = [];
	public total = 0

	private getList() {
		this.service.categoryList({data: this.query})
			.subscribe((r: any) => {
				this.tableData = r.data.result;
				this.total = r.data.total
			})
	}

	public isConfirmLoading = false

	public confirm() {
		const data = this.form.value;
		const service = data.id ? this.service.categoryUpdate : this.service.categoryAdd;
		this.isConfirmLoading = true
		const complete = () => {
			this.isConfirmLoading = false
			this.msg.success('操作成功');
			this.modal = false
			this.getList()
		}
		if (data.id) {
			this.service.categoryUpdate({data})
				.subscribe(() => complete())
		} else {
			this.service.categoryAdd({data})
				.subscribe(() => complete())
		}

	}

	protected readonly customElements = customElements;

	public del(s: any) {
		this.service.categoryDel({
			variable: {id: s.id}
		})
			.subscribe(() => {
				this.msg.success('删除成功')
				this.getList()
			})
	}

	public edit(s: Record<string, any>) {
		this.form.patchValue(s)
		this.modal = true
	}

	public pageChange($event: number, type: string) {
		if (type === 'size') this.query.pageSize = $event
		if (type === 'number') this.query.pageNumber = $event
		this.getList()
	}
}
