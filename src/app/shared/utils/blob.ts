import {Observable} from "rxjs";

export class BlobUtil {
	static toDataUri(f: File): Observable<string> {
		return new Observable<string>( s => {
			const fr = new FileReader()
			fr.readAsDataURL(f)
			fr.onload = e => {
				const result = e.target?.result as string
				s.next( result )
			}
		})
	}
 }
