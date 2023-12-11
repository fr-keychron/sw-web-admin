import {Pipe, PipeTransform} from "@angular/core";

import {Enums} from "../../model";
@Pipe({
	name: 'EnumPipe'
})
export class EnumPipe implements PipeTransform {
	transform(value: string, enums: Enums): string {
		const item = enums.find( i => i.value === value )
		return item?.label ?? value
	}
}
