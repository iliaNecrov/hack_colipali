import '@/app/App.css';
import { withProviders } from '@/app/providers/with-providers.ts';
import { MainRouter } from '@/pages/MainRouter.tsx';
import { ConfigProvider, theme } from 'antd';
import { useThemeWatcher } from '@/entities/hocs/useThemeWatcher.tsx';
import { useAppSelector } from '@/store/hooks/redux.hook.ts';
import { themeObject } from '@/app/styles/theme/theme-variables.ts';
import GlobalStyle from '@/app/styles/global-styles.ts';
function App() {
  const reduxTheme = useAppSelector(state => state.theme.theme);
  useThemeWatcher();
  return (
    <>
      <meta name="theme-color" content={themeObject[reduxTheme].primary} />
      <GlobalStyle />
      <ConfigProvider
        theme={{
          algorithm: reduxTheme !== 'light' ? theme.darkAlgorithm : theme.defaultAlgorithm,
        }}
      >
        <MainRouter />
      </ConfigProvider>
    </>
  );
}

const EnhancedApp = withProviders(App);
export default EnhancedApp;
