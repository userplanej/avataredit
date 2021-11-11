import React, { Component } from 'react';
import { Helmet } from 'react-helmet';
import { connect } from 'react-redux';
import { Switch, Route, Redirect } from 'react-router-dom';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { Alert, Snackbar } from '@mui/material';

import Main from '../components-site/Main';
import Authentication from '../components-site/views/authentication/Authentication';

import { theme } from '../styles/theme';
import '../styles/index.less';

import { setAlertOpen } from '../redux/alert/alertSlice';

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
						<Route path="/login" component={Authentication} />
						<Redirect from="*" to={sessionStorage.getItem('logged') !== null ? '/studio/home' : '/login'} />
					</Switch>
      	</ThemeProvider>

				<Snackbar
					autoHideDuration={6000}
					anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
					open={this.props.alertOpen}
					onClose={() => this.props.setAlertOpen(false)}
				>
					<Alert variant="filled" onClose={() => this.props.setAlertOpen(false)} severity={this.props.alertSeverity} sx={{ width: '100%' }}>
						{this.props.alertMessage}
					</Alert>
				</Snackbar>
			</div>
		);
	}
}

const mapStateToProps = state => ({
	alertMessage: state.alert.message,
	alertSeverity: state.alert.severity,
	alertOpen: state.alert.open
});

const mapDispatchToProps  = {
	setAlertOpen
}

export default connect(mapStateToProps, mapDispatchToProps)(App);
