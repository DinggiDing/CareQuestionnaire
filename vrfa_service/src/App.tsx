import { Grid, ThemeProvider, createTheme, responsiveFontSizes } from '@mui/material';
import { initializeApp } from 'firebase/app';
import "firebase/storage";
import 'firebase/firestore';
import { firebaseConfig } from './config';
import { routes as appRoutes } from "./routes";
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import "./pages/style/global.css";
import ProtectedRoute from './hooks/ProtectedRoute';
// In your App.jsx or similar file
import { AuthProvider } from './hooks/useAuth';


let fontTheme = createTheme();
fontTheme = responsiveFontSizes(fontTheme);

initializeApp(firebaseConfig);

function App() {
  const styles = {
    rootContainer: {
      // backgroundColor: "orange",
      overflow: 'hidden'
    }
  }

  return (
    <ThemeProvider theme={fontTheme}>
      <Grid
        container
        direction="column"
        sx={styles.rootContainer} >
        <Router>
        <AuthProvider>

          <Routes>
            
            {appRoutes.map((route) => (
                <Route
                  key={route.key}
                  path={route.path}
                  element={
                  (route.useAuth) ? <ProtectedRoute>
                    <route.component />
                    </ProtectedRoute> :  
                    <route.component />
                  }
                  >



                    {route.children?.map((childRoute: any) => (
                      <Route
                        key={childRoute.key}
                        path={childRoute.path}
                        element={
                          <childRoute.component />
                        }
                      />
                    ))}
                </Route>
            ))}
          </Routes>
          </AuthProvider>

        </Router>
      </Grid>
    </ThemeProvider>
  );
}

export default App;
