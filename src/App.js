/*global chrome*/
import React from 'react';
import Container from '@mui/material/Container';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import Skeleton from '@mui/material/Skeleton';
import Typography from '@mui/material/Typography';

import CreateTabsList from './CreateTabsList';
import CreateToggleButton from './CreateToggleButton';

function App() {
	const [tabWindows, setTabWindowsData] = React.useState(null);
	const [currentWindowId, setCurrentWindowId] = React.useState(null);
	const [isDataAvailable, setIsDataAvailable] = React.useState(false);
	const [alignment, setAlignment] = React.useState('current');
	const [reloadComponent, setReloadComponent] = React.useState(false);

	const loadPopupDetails = () => {
		chrome.windows.getCurrent((window) => {
			setCurrentWindowId(window.id.toString());
		});

		chrome.storage.local.get(['focussedWindow'], (data) => {
			if (data?.focussedWindow) {
				setIsDataAvailable(true);
				setTabWindowsData(data.focussedWindow);
			} else {
				setIsDataAvailable(false);
			}
		});
	};
	React.useEffect(() => {
		loadPopupDetails();
	}, [alignment, reloadComponent]);

	return (
		<Container sx={{ padding: '20px' }}>
			{isDataAvailable ? (
				<>
					<CreateToggleButton
						windowType={alignment}
						setWindowType={setAlignment}
					/>
					<CreateTabsList
						alignment={alignment}
						isComponentDirty={reloadComponent}
						setIsComponentDirty={setReloadComponent}
						tabsList={tabWindows}
						currentWindowId={currentWindowId}
					/>
				</>
			) : (
				<Stack spacing={1}>
					<Skeleton variant='rounded' width={210} height={60} />
					<Typography sx={{ fontSize: 14 }} variant='h6' component='h6'>
						Recently Visited tabs will be listed here!
					</Typography>
				</Stack>
			)}
			<Button
				sx={{ display: 'block', marginTop: 2 }}
				variant='outlined'
				size='small'
				onClick={() => {
					chrome.storage.local.clear();
					window.close();
				}}
			>
				Clear Data
			</Button>
		</Container>
	);
}

export default App;
