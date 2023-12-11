import { Component, ElementRef, OnInit, Renderer2 } from '@angular/core';
import {
	NavigationEnd,
	NavigationError,
	RouteConfigLoadStart,
	Router,
	RouterOutlet,
} from '@angular/router';
import {
	TitleService,
	VERSION as VERSION_ALAIN,
	stepPreloader, MenuService
} from '@delon/theme';
import { environment } from '@env/environment';
import { NzModalService } from 'ng-zorro-antd/modal';
import { VERSION as VERSION_ZORRO } from 'ng-zorro-antd/version';
import { StartupService } from '@core';
import { sessionStorage } from './service/storage';

@Component({
	selector: 'app-root',
	template: ` <router-outlet />`,
	standalone: true,
	imports: [RouterOutlet],
})
export class AppComponent implements OnInit {
	private donePreloader = stepPreloader();

	constructor(
		el: ElementRef,
		renderer: Renderer2,
		private router: Router,
		private titleSrv: TitleService,
		private modalSrv: NzModalService,
		private menuService: MenuService,
		private startService: StartupService
	) {
		renderer.setAttribute(
			el.nativeElement,
			'ng-alain-version',
			VERSION_ALAIN.full,
		);
		renderer.setAttribute(
			el.nativeElement,
			'ng-zorro-version',
			VERSION_ZORRO.full,
		);
	}

	ngOnInit(): void {
		let configLoad = false;
		this.router.events.subscribe((ev) => {
			if (ev instanceof RouteConfigLoadStart) {
				configLoad = true;
			}
			if (configLoad && ev instanceof NavigationError) {
				this.modalSrv.confirm({
					nzTitle: `提醒`,
					nzContent: environment.production
						? `应用可能已发布新版本，请点击刷新才能生效。`
						: `无法加载路由：${ev.url}`,
					nzCancelDisabled: false,
					nzOkText: '刷新',
					nzCancelText: '忽略',
					nzOnOk: () => location.reload(),
				});
			}
			if (ev instanceof NavigationEnd) {
				this.donePreloader();
				this.titleSrv.setTitle();
				this.modalSrv.closeAll();
			}
		});

		this.startService.load()
			.subscribe(() => {
				if(sessionStorage.exist('menu')) {
					this.menuService.add(sessionStorage.get('menu'))
				}
			})
	}
}
