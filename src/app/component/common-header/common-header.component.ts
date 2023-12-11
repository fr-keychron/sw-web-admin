import { Component, Input } from '@angular/core';

@Component({
	selector: 'common-header',
	template: `
		<div class = 'common-header'>
			{{ title }}
		</div>
	`,
	styles: [`
		.common-header {
			font-size: 16px;
			font-weight: bolder;
			text-indent: 15px;
			position: relative;
			margin-bottom: 16px;
			&::before{
				content: '';
				display: block;
				width: 4px;
				height: 70%;
				position: absolute;
				top: 15%;
				left: 0;
				background: #1890ff ;
			}
		}
	`]
})
export class CommonHeaderComponent {
	@Input() title: string = ''
}
