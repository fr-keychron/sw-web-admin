import { Component, OnInit } from "@angular/core";
import { BugService } from "../../../service/bug/buglist.service";

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

	tableData: any[] = [];
	total: number = 0;
	columns: any[] = [{
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
	}, {
		code: 'createTime',
		name: '提交日期',
		width: '180px'
	}
	]

	query = {
		pageSize: 10,
		pageNumber: 1,
		device: '',
		pid: ''
	}

	getList() {
		this.service.list({ data: this.query })
			.subscribe((r: any) => {
				this.tableData = r.data.result;
				this.total = r.data.total;
			})
	}

	sizeChange($event: number, type: 'size' | 'index') {
		if (type === 'size') this.query.pageSize = $event;
		if (type === 'index') this.query.pageNumber = $event;
		this.getList();
	}

	clear() {
		this.query.device = '';
		this.query.pid = '';
	}
}
