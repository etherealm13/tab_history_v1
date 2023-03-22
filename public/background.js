/*global chrome*/

const DEFAULT_CACHE_SIZE = 5;
chrome.tabs.onHighlighted.addListener(async () => {
	await chrome.tabs.query(
		{ active: true, currentWindow: true },
		async ([tab]) => {
			try {
				let windows = await chrome.storage.local.get(['focussedWindow']);

				let cacheSizeFromStorage = await chrome.storage.local.get([
					'CUSTOM_CACHE_SIZE',
				]);

				if (!cacheSizeFromStorage.CUSTOM_CACHE_SIZE) {
					cacheSizeFromStorage = { CUSTOM_CACHE_SIZE: DEFAULT_CACHE_SIZE };
				}

				if (!windows.focussedWindow) {
					windows.focussedWindow = {};
				}
				if (!windows.focussedWindow[tab.windowId]) {
					windows.focussedWindow[tab.windowId] = [];
				}
				let result = windows.focussedWindow[tab.windowId];
				let filteredTabList = result.filter((t) => t.id !== tab.id);

				filteredTabList.unshift(tab);

				filteredTabList = filteredTabList.slice(
					0,
					cacheSizeFromStorage.CUSTOM_CACHE_SIZE
				);
				chrome.storage.local.set({
					focussedWindow: {
						...windows.focussedWindow,
						[tab.windowId]: [...filteredTabList],
					},
				});
				chrome.storage.local.set({
					CUSTOM_CACHE_SIZE: cacheSizeFromStorage.CUSTOM_CACHE_SIZE,
				});
			} catch (error) {
				console.log(error);
			}
		}
	);
});
