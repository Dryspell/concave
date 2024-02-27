export const isStorageIdResponse = (
	response: unknown
): response is { storageId: string } => {
	if (typeof response !== "object" || response === null) {
		return false;
	}
	return Boolean("storageId" in response);
};
