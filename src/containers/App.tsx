import React, { Component } from 'react';
import { Helmet } from 'react-helmet';
import { Switch, Route } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import '../styles/index.less';
import Main from '../components-site/Main';
import Authentication from '../components-site/views/authentication/Authentication';

const theme = createTheme({
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
		}
	}
});

class App extends Component<any> {
	render() {
		return (
			<div style={{height: '100%'}}>
				<Helmet>
					<meta charSet="utf-8" />
					<meta name="viewport" content="width=device-width, initial-scale=1.0" />
					<meta
						name="description"
						content="M Studio"
					/>
					<link rel="manifest" href="/manifest.json" />
					<link rel="shortcut icon" href="/favicon.ico" />
					<link rel="stylesheet" href="https://fonts.googleapis.com/earlyaccess/notosanskr.css" />
					<title>M Studio</title>
					<script async={true} src="https://www.googletagmanager.com/gtag/js?id=UA-97485289-3" />
					<script>
						{`
                        window.dataLayer = window.dataLayer || [];
                        function gtag(){dataLayer.push(arguments);}
                        gtag('js', new Date());
                        gtag('config', 'UA-97485289-3');
                        `}
					</script>
					<script async={true} src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js" />
				</Helmet>

				<ThemeProvider theme={theme}>
					<CssBaseline />
					<Switch>
						<Route path="/studio" component={Main} />
						<Route path="/" component={Authentication} />
					</Switch>
      	</ThemeProvider>
			</div>
		);
	}
}

export default App;
