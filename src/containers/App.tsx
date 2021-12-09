import React, { Component } from 'react';
import { Helmet } from 'react-helmet';
import { connect } from 'react-redux';
import { Switch, Route, Redirect } from 'react-router-dom';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { Alert, Dialog, DialogActions, DialogContent, DialogTitle, Snackbar, Typography, Button } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';

import Main from '../components-site/Main';
import Authentication from '../components-site/views/authentication/Authentication';

import { theme } from '../styles/theme';
import '../styles/index.less';

import { setAlertOpen } from '../redux/alert/alertSlice';
import { setDialogAlertOpen } from '../redux/dialog-alert/dialogAlertSlice';

class App extends Component<any> {
	render() {
		return (
			<div style={{ height: '100%' }}>
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
						<Redirect from="*" to={sessionStorage.getItem('user') !== null ? '/studio/home' : '/login'} />
					</Switch>

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

					<Dialog
						maxWidth="sm"
						open={this.props.dialogAlertOpen}
						aria-labelledby="alert-dialog-title"
						aria-describedby="alert-dialog-description"
					>
						<DialogTitle id="alert-dialog-title" sx={{ textAlign: 'right' }}>
							<CloseIcon fontSize="large" onClick={() => this.props.setDialogAlertOpen(false)} sx={{ cursor: 'pointer', color: '#fff' }} />
						</DialogTitle>

						<DialogContent sx={{ color: "#9a9a9a" }}>
							<Typography variant="h5" color="#fff" sx={{ mb: 2 }}>
								{this.props.dialogAlertTitle}
							</Typography>

							{this.props.dialogAlertMessage}
						</DialogContent>

						<DialogActions>
							<Button variant="contained" fullWidth onClick={() => this.props.setDialogAlertOpen(false)}>
								{this.props.dialogAlertButtonText}
							</Button>
						</DialogActions>
					</Dialog>
      	</ThemeProvider>
			</div>
		);
	}
}

const mapStateToProps = state => ({
	alertMessage: state.alert.message,
	alertSeverity: state.alert.severity,
	alertOpen: state.alert.open,
	dialogAlertTitle: state.dialogAlert.title,
	dialogAlertMessage: state.dialogAlert.message,
	dialogAlertButtonText: state.dialogAlert.buttonText,
	dialogAlertOpen: state.dialogAlert.open
});

const mapDispatchToProps  = {
	setAlertOpen,
	setDialogAlertOpen
}

export default connect(mapStateToProps, mapDispatchToProps)(App);
