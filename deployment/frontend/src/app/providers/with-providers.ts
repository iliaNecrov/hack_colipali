import compose from 'compose-function';
import { withRouter } from '@/app/providers/BrowserRouter.tsx';

export const withProviders = compose(withRouter);
