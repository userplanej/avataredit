import React from 'react';
import ReactDom from 'react-dom';
import { BrowserRouter } from 'react-router-dom';
import { AppContainer } from 'react-hot-loader';
import { LocaleProvider } from 'antd';
import koKR from 'antd/lib/locale-provider/ko_KR';
import enUS from 'antd/lib/locale-provider/en_US';

import { i18nClient } from './i18n';
import App from './containers/App';
import registerServiceWorker from './registerServiceWorker';

import { store } from './redux/store';
import { Provider } from 'react-redux';

// import { makeServer } from './exam.server';

// if (process.env.NODE_ENV === 'development') {
// 	makeServer({ environment: 'development' });
// }

const antResources = {
	ko: koKR,
	'ko-KR': koKR,
	en: enUS,
	'en-US': enUS,
};

const root = document.createElement('div');
root.id = 'root';
document.body.appendChild(root);

const render = Component => {
	const rootElement = document.getElementById('root');
	ReactDom.render(
		<Provider store={store}>
			<BrowserRouter>
				<AppContainer >
					<LocaleProvider locale={antResources[i18nClient.language]}>
						<Component />
					</LocaleProvider>
				</AppContainer>
			</BrowserRouter>
		</Provider>,
		rootElement,
	);
};

render(App);
if (module.hot) {
	module.hot.accept('./containers/App', () => {
		render(App);
	});
}

registerServiceWorker();
