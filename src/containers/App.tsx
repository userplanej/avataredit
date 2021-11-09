import React, { Component } from 'react';
import { Helmet } from 'react-helmet';
import { Switch, Route } from 'react-router-dom';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import '../styles/index.less';
import Main from '../components-site/Main';
import Authentication from '../components-site/views/authentication/Authentication';
import { theme } from '../styles/theme';

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
					<link rel="shortcut icon" href="/images/img_signature.png" />
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
