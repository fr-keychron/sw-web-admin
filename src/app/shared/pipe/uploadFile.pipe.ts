import {Pipe, PipeTransform} from "@angular/core";
import {GLOBAL_CONFIG} from "../../config";
@Pipe({
	name: 'UploadFile'
})
export class UploadFile implements PipeTransform {
	transform(value: string): string {
		return GLOBAL_CONFIG.HOST + value ;
	}
}
