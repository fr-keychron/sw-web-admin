export class StrUtil {
	static tmpReplace(s: string, map: Record<string, any>): string {
		return s.replace(/#\{(\w+)}/gi, (v: string) => {
			const key = /#\{(\w+)}/.exec(v)
			return key ? map[key[1]] : v
		} )
	}
}
