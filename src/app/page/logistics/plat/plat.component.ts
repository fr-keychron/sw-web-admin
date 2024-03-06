import {Component, OnInit} from "@angular/core";
import {LogisticsService} from "../../../service/logistics/logistics.service";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {ActivatedRoute} from "@angular/router";

@Component({
	selector: 'plat',
	templateUrl: './plat.component.html',
	styleUrls: ['./plat.component.scss']
})
export class PlatComponent implements OnInit {
	constructor(
		private readonly service: LogisticsService,
		private readonly fb: FormBuilder,
		private readonly route: ActivatedRoute
	) {
	}

	private plat: number
	private shop: number

	ngOnInit() {
		this.route.params.subscribe(r => {
			const {p, s} = r
			this.plat = p
			this.shop = s;
			this.getList()
		})
	}

	public tableData: any[] = [];

	public provider: any[] = [];

	public query = {
		pageSize: 10,
		pageNumber: 10
	}

	public sizeChange($event: number, type: 'size' | 'page') {
		if (type === "size") this.query.pageSize = $event;
		if (type === 'page') this.query.pageNumber = $event;
		this.getList()
	}

	public getList() {
		this.service.raw({data: this.query, variable: {p: this.plat, s: this.shop}})
			.subscribe((r: any) => {
				this.total = r.data.total;
				this.tableData = r.data.result.data;
				this.th = r.data.result.th
			})
	}

	public modal = false
	public th: any[] = []
	public total = 0
}
