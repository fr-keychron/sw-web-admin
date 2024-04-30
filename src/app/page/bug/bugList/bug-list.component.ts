import { Component, OnInit } from "@angular/core";
import { BugService } from "../../../service/bug/buglist.service";
import { NzInputModule } from 'ng-zorro-antd/input';

@Component({
	selector: 'list',
	templateUrl: './bug-list.component.html',
	styleUrls: ['./bug-list.component.scss']
})
export class BugListComponent implements OnInit {
	constructor(
		private readonly service: BugService,
	) {
	}

	ngOnInit() {
		this.getList()
	}

	public tableData: any[] = [];
	public total: number = 0;
	public columns: any[] = [{
		code: 'title',
		name: '标题',
		width: '180px'
	}, {
		code: 'content',
		name: '内容',
		width: '200px'
	}, {
		code: 'email',
		name: '邮箱',
		width: '180px'
	}, {
		code: 'device',
		name: '设备名称',
		width: '180px'
	}, {
		code: 'pid',
		name: '设备ID',
		width: '100px'
	}
	]

	public query = {
		pageSize: 10,
		pageNumber: 1
	}

	public getList() {
		this.service.list({ data: this.query })
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
}
