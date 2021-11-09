import { createTheme } from '@mui/material/styles';

export const theme = createTheme({
  typography: {
    fontFamily: 'Omnes'
  },
	components: {
		MuiFormLabel: {
			styleOverrides: {
				root: {
					color: "#4f4081", fontWeight: 'bold'
				}
			}
		},
		MuiTypography: {
			styleOverrides: {
				h4: {
					fontWeight: "bold",
					color: '#4f4081'
				},
				h5: {
					fontWeight: "bold",
					color: '#09113c'
				}
			}
		},
		MuiButton: {
			styleOverrides: {
				containedPrimary: {
					paddingBlock: 10,
					backgroundColor: '#df678c', 
					borderRadius: '10px',
					'&:hover': { backgroundColor: 'rgba(223, 103, 140, 0.9)' },
					'&:disabled': { backgroundColor: '#5b5c62', color: '#fff' }
				},
				containedSecondary: {
					paddingBlock: 10,
					maxWidth: '150px',
					color: '#09113c',
					backgroundColor: '#e8e9e9', 
					borderRadius: '10px', 
					'&:hover': { backgroundColor: 'rgba(232, 233, 233, 0.9)' } 
				}
			}
		},
		MuiCheckbox: {
			styleOverrides: {
				root: {
					"&.Mui-checked": {
						"color": "#0a1239"
					}
				}
			}
		},
		MuiDialogActions: {
			styleOverrides: {
				root: {
					padding: '16px 24px'
				}
			}
		},
		MuiTabs: {
			styleOverrides: {
				indicator: {
					width: '100%',
					backgroundColor: '#d06e8c'
				}
			}
		},
		MuiTab: {
			styleOverrides: {
				root: {
					fontSize: '15px',
					backgroundColor: '#e8e9e9',
					textTransform: 'none',
					fontWeight: 'bold',
					'&.Mui-selected': {
						color: '#09113c',
						backgroundColor: '#f5f0fa',
						border: 'none'
					}
				}
			}
		},
		MuiSwitch: {
			styleOverrides: {
				root: {
					width: 42,
					height: 26,
					padding: 0,
					'& .MuiSwitch-switchBase': {
						padding: 0,
						margin: 2,
						transitionDuration: '300ms',
						'&.Mui-checked': {
							transform: 'translateX(16px)',
							color: '#df678c',
							'& + .MuiSwitch-track': {
								backgroundColor: '#f5f0fa',
								opacity: 1,
								border: 0,
							},
							'&.Mui-disabled + .MuiSwitch-track': {
								opacity: 0.5,
							},
						},
						'&.Mui-focusVisible .MuiSwitch-thumb': {
							color: '#33cf4d',
							border: '6px solid #fff',
						},
						'&.Mui-disabled .MuiSwitch-thumb': {
							color: 'grey',
						},
						'&.Mui-disabled + .MuiSwitch-track': {
							opacity: 0.7,
						},
					},
					'& .MuiSwitch-thumb': {
						boxSizing: 'border-box',
						width: 22,
						height: 22,
					},
					'& .MuiSwitch-track': {
						borderRadius: 26 / 2,
						backgroundColor: '#E9E9EA',
						opacity: 1
					}
				}
			}
		}
	}
});