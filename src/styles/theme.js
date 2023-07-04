import { createTheme } from '@mui/material/styles';

export const theme = createTheme({
  typography: {
    fontFamily: 'Arial'
  },
	components: {
		MuiFilledInput: {
			styleOverrides: {
				root: {
					color: '#fff',
					border: 'solid 2px #3c4045',
					borderRadius: '5px',
					boxShadow: '3px 3px 6px 0 rgba(0, 0, 0, 0.02)',
					backgroundColor: '#202427',
					':focus-within': {
						backgroundColor: '#202427',
						border: '2px solid #e8dff4'
					},
					'.MuiFilledInput-input': {
						padding: '13px'
					}
				},
				input: {
					':disabled': {
						WebkitTextFillColor: '#fff'
					}
				}
			}
		},
		MuiFormLabel: {
			styleOverrides: {
				root: {
					color: "#fff"
				}
			}
		},
		MuiListItemText: {
			styleOverrides: {
				primary: {
					color: '#fff'
				},
				secondary: {
					color: '#fff'
				}
			}
		},
		MuiTypography: {
			styleOverrides: {
				h4: {
					color: '#fff'
				},
				h5: {
					color: '#9a9a9a'
				},
				h6: {
					color: '#9a9a9a'
				},
				caption: {
					color: '#9a9a9a'
				},
				subtitle1: {
					color: '#9a9a9a'
				},
				body2: {
					color: '#9a9a9a'
				}
			}
		},
		MuiButton: {
			styleOverrides: {
				containedPrimary: {
					paddingBlock: 10,
					backgroundImage: 'linear-gradient(to right, #fd9483 -2%, #fd72a6 23%, #b85bfa 69%, #676aff 103%)',
					backgroundColor: 'transparent',
					borderRadius: '10px',
					'&:hover': { 
						backgroundPosition: 'right center'
					},
					'&:disabled': { backgroundColor: '#9a9a9a', backgroundImage: 'none', color: '#202427' }
				},
				containedSecondary: {
					paddingBlock: 9,
					maxWidth: '150px',
					color: '#9a9a9a',
					border: 'solid 2px #babbbb',
					backgroundColor: '#202427', 
					borderRadius: '10px', 
					'&:hover': { backgroundColor: 'rgba(232, 233, 233, 0.2)' },
					'&:disabled': { color: '#9a9a9a' }
				}
			}
		},
		MuiCheckbox: {
			styleOverrides: {
				root: {
					"&.Mui-checked": {
						"color": "#fff"
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
					backgroundColor: '#fff'
				}
			}
		},
		MuiTab: {
			styleOverrides: {
				root: {
					fontSize: '15px',
					backgroundColor: '#3c4045',
					color: '#fff',
					textTransform: 'none',
					fontWeight: 'bold',
					'&.Mui-selected': {
						color: '#202427',
						backgroundColor: '#feffff',
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
						color: '#babbbb',
						'&.Mui-checked': {
							transform: 'translateX(16px)',
							color: 'transparent',
							backgroundImage: 'linear-gradient(to right, #fd9483 -2%, #fd72a6 23%, #b85bfa 69%, #676aff 103%)',
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
		},
		MuiDialog: {
			styleOverrides: {
				paper: {
					backgroundColor: '#202427'
				}
			}
		},
		MuiChip: {
			styleOverrides: {
				root: {
					backgroundColor: '#3c4045',
					color: '#9a9a9a'
				}
			}
		},
		MuiSelect: {
			styleOverrides: {
				root: {
					color: '#fff',
					border: 'solid 2px #3c4045',
					borderRadius: '5px',
					':focus-within': {
						backgroundColor: '#202427',
						border: '2px solid #3c4045'
					}
				},
				icon: {
					color: '#fff'
				},
				filled: {
					padding: '10px'
				}
			}
		}
	}
});