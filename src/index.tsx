import { Root, createRoot } from 'react-dom/client';

import AppRoutes from './routes';
import { CartProvider } from './context/CartProvider';
import { Provider } from 'react-redux';
import store from './redux/store';
import './index.scss';

const root: Root = createRoot( document.getElementById('root') as HTMLDivElement);

root.render(
            <Provider store={store}>
                    <CartProvider>
                        <AppRoutes />
                    </CartProvider>
            </Provider>
 );


