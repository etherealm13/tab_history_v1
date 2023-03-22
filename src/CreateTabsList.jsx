/*global chrome*/
import React from 'react';
import Avatar from '@mui/material/Avatar';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import Tooltip from '@mui/material/Tooltip';
import VolumeUpIcon from '@mui/icons-material/VolumeUp';
import VolumeOffIcon from '@mui/icons-material/VolumeOff';

const CreateTabsList = ({
	alignment,
	tabsList,
	currentWindowId,
	isComponentDirty,
	setIsComponentDirty,
}) => {
	const handleMakeTabActive = (tab) => {
		chrome.tabs.query({}, (tabs) => {
			if (tabs.some((item) => item.id.toString() === tab.id.toString())) {
				if (currentWindowId !== tab.windowId.toString()) {
					chrome.windows.update(tab.windowId, { focused: true }, () => {
						chrome.tabs.update(tab.id, { active: true });
					});
				} else {
					chrome.tabs.update(tab.id, { active: true });
				}
			} else {
				alert('tab closed');
				let result = tabsList[tab.windowId];
				let filteredTabList = result.filter((t) => t.id !== tab.id);
				chrome.storage.local.set({
					focussedWindow: {
						...tabsList,
						[tab.windowId]: [...filteredTabList],
					},
				});
			}
			setIsComponentDirty(!isComponentDirty);
		});
	};

	const handleMakeAudibleTabMute = async (tab) => {
		const muted = !tab.mutedInfo.muted;

		let result = tabsList[tab.windowId];
		let updatedTabList = result.map((t) =>
			t.id.toString() === tab.id.toString()
				? { ...t, mutedInfo: { ...t.mutedInfo, muted: muted } }
				: t
		);

		await chrome.storage.local.set({
			focussedWindow: {
				...tabsList,
				[tab.windowId]: [...updatedTabList],
			},
		});
		await chrome.tabs.query({}, () => {
			chrome.tabs.update(tab.id, { muted });
			setIsComponentDirty(!isComponentDirty);
		});
	};

	const handleRemoveTab = (tab) => {
		chrome.tabs.query({}, (tabs) => {
			let result = tabsList[tab.windowId];
			let filteredTabList = result.filter(
				(t) => t.id.toString() !== tab.id.toString()
			);
			chrome.storage.local.set({
				focussedWindow: {
					...tabsList,
					[tab.windowId]: [...filteredTabList],
				},
			});
			if (tabs.some((item) => item.id.toString() === tab.id.toString())) {
				chrome.tabs.remove([tab.id]);
			}
			setIsComponentDirty(!isComponentDirty);
		});
	};

	const createTabLayout = () => {
		return Object.keys(tabsList).map((id, idx) => {
			const listOfTabsInSameWindow = tabsList[id];
			if (alignment === 'current' && id !== currentWindowId) {
				return null;
			}
			return listOfTabsInSameWindow.map((tab) => {
				return (
					<TableRow
						key={tab.id}
						hover={true}
						sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
					>
						<TableCell align='center' component='th' scope='row'>
							{idx + 1}
						</TableCell>
						<TableCell component='th' scope='row'>
							<Avatar
								sx={{ width: 24, height: 24 }}
								alt={tab.title}
								src={tab.favIconUrl}
							/>
						</TableCell>
						<TableCell component='th' scope='row'>
							<Typography sx={{ fontSize: 14 }} variant='h6' component='h6'>
								{tab.title}
								{tab.audible && (
									<>
										{!tab.mutedInfo.muted && (
											<Tooltip title='Tab is playing audio. Click to mute.'>
												<VolumeUpIcon
													onClick={() => handleMakeAudibleTabMute(tab)}
													sx={{
														color: '#2196F3',
														width: 18,
														height: 18,
														position: 'relative',
														top: ' 5px',
														left: '10px',
														cursor: 'pointer',
													}}
												/>
											</Tooltip>
										)}
										{tab.mutedInfo.muted && (
											<Tooltip title='Tab is muted. Click to unmute'>
												<VolumeOffIcon
													onClick={() => handleMakeAudibleTabMute(tab)}
													sx={{
														color: '#9e9e9e',
														width: 18,
														height: 18,
														position: 'relative',
														top: ' 5px',
														left: '10px',
														cursor: 'pointer',
													}}
												/>
											</Tooltip>
										)}
									</>
								)}
							</Typography>
						</TableCell>
						<TableCell
							component='th'
							scope='row'
							sx={{ cursor: 'pointer', color: '#018ce1' }}
							onClick={() => handleMakeTabActive(tab)}
						>
							Visit
						</TableCell>
						<TableCell
							component='th'
							scope='row'
							sx={{ cursor: 'pointer', color: '#ff6587' }}
							onClick={() => handleRemoveTab(tab)}
						>
							Remove
						</TableCell>
					</TableRow>
				);
			});
		});
	};

	return (
		<TableContainer component={Paper}>
			<Table sx={{ minWidth: 600, maxWidth: '100%' }} aria-label='simple table'>
				<TableHead>
					<TableRow>
						<TableCell>#Window</TableCell>
						<Tooltip title='Sorted by Most Recent'>
							<TableCell align='center' colSpan={2}>
								Tab
							</TableCell>
						</Tooltip>
						<TableCell align='center' colSpan={2}>
							Action
						</TableCell>
					</TableRow>
				</TableHead>
				<TableBody>{createTabLayout()}</TableBody>
			</Table>
		</TableContainer>
	);
};

export default CreateTabsList;
