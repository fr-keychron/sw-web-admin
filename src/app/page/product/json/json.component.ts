import {Component} from "@angular/core";
import {MsgService} from "../../../service/msg/msg.service";
import {
	keyboardDefinitionV2ToVIADefinitionV2,
	isVIADefinitionV2,
	isKeyboardDefinitionV2,
	keyboardDefinitionV3ToVIADefinitionV3,
	isVIADefinitionV3,
	isKeyboardDefinitionV3,
	DefinitionVersionMap,
	VIADefinitionV2,
	VIADefinitionV3,
} from '@the-via/reader' ;

@Component({
	selector: 'json',
	templateUrl: './json.component.html',
	styleUrls: ['./json.component.scss']
})
export class JsonComponent {
	public protocol: "V3" | "V2" = 'V3';
	public jsonStr = '';

	constructor(
		private msg: MsgService
	) {
	}

	public trans() {
		if (!this.jsonStr) return this.msg.error('json不能为空');
		try {
			const jsonObj = JSON.parse(this.jsonStr);
			const venderId = Number(jsonObj.vendorId)
			const productId = Number(jsonObj.productId);
			const id = venderId * 65536 + productId;
			const res = jsonObj
			const isValid =
				this.protocol === 'V2'
					? isKeyboardDefinitionV2(res) || isVIADefinitionV2(res)
					: isKeyboardDefinitionV3(res) || isVIADefinitionV3(res);

			if (!isValid) return this.msg.error('错误的VIA格式');
			const definition =
				this.protocol === 'V2'
					? isVIADefinitionV2(res)
						? res
						: keyboardDefinitionV2ToVIADefinitionV2(res)
					: isVIADefinitionV3(res)
						? res
						: keyboardDefinitionV3ToVIADefinitionV3(res);

			const str = JSON.stringify(definition , null , 2 ) ;
			var dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(str);
			var downloadAnchorNode = document.createElement('a');
			downloadAnchorNode.setAttribute("href",     dataStr);
			downloadAnchorNode.setAttribute("download", id + ".json");
			document.body.appendChild(downloadAnchorNode);
			downloadAnchorNode.click();
			downloadAnchorNode.remove();
			this.jsonStr = '' ;
		} catch (e) {
			this.msg.error('错误的json格式')
		}
	}
}
