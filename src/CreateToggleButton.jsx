/*global chrome*/
import React from 'react';
import Grid from '@mui/material/Grid';
import ToggleButton from '@mui/material/ToggleButton';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';

const CreateToggleButton = ({ windowType, setWindowType }) => {
	const [tabsCacheSize, setTabCacheSize] = React.useState(5);

	React.useEffect(() => {
		chrome.storage.local.get('CUSTOM_CACHE_SIZE', (result) => {
			let cacheSize = 5;
			if (result?.CUSTOM_CACHE_SIZE) {
				cacheSize = result.CUSTOM_CACHE_SIZE;
			}
			setTabCacheSize(cacheSize);
		});
	}, [tabsCacheSize]);

	const handleWindowTypeChange = (event, newType) => {
		if (newType !== null) {
			setWindowType(newType);
		}
	};

	const handleTabCacheSizeChange = (event, newSize) => {
		if (newSize !== null) {
			chrome.storage.local.set({
				CUSTOM_CACHE_SIZE: newSize,
			});
			setTabCacheSize(newSize);
		}
	};

	return (
		<Grid justifyContent='space-between' container direction='row'>
			<Grid item xs={8}>
				<ToggleButtonGroup
					sx={{ marginBottom: 2 }}
					color='primary'
					exclusive
					value={windowType}
					onChange={handleWindowTypeChange}
					aria-label='Window'
				>
					<ToggleButton value='current'>Current Window</ToggleButton>
					<ToggleButton value='all'>All Windows</ToggleButton>
				</ToggleButtonGroup>
			</Grid>
			<Grid item xs={4}>
				<ToggleButtonGroup
					sx={{ marginBottom: 2 }}
					color='primary'
					value={tabsCacheSize}
					exclusive
					onChange={handleTabCacheSizeChange}
					aria-label='Tab Cache Size'
				>
					<ToggleButton value={5}>5 Tabs</ToggleButton>
					<ToggleButton value={10}>10 Tabs</ToggleButton>
				</ToggleButtonGroup>
			</Grid>
		</Grid>
	);
};

export default CreateToggleButton;
