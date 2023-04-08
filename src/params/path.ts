export function match(param) {
	return !/^blog/.test(param) && !/^index/.test(param);
}
