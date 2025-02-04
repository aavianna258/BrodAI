import * as React from 'react';
import CssBaseline from '@mui/material/CssBaseline';
import Divider from '@mui/material/Divider';
// import AppTheme from '../../theme/AppTheme';
import AppAppBar from '../../components/muiTemplate/AppAppBar';
import Hero from '../../components/muiTemplate/Hero';
import LogoCollection from '../../components/muiTemplate/LogoCollection';
import Highlights from '../../components/muiTemplate/Highlights';
import Pricing from '../../components/muiTemplate/Pricing';
import Features from '../../components/muiTemplate/Features';
import Testimonials from '../../components/muiTemplate/Testimonials';
import FAQ from '../../components/muiTemplate/FAQ';
import Footer from '../../components/muiTemplate/Footer';

export default function MarketingPage(props: { disableCustomTheme?: boolean }) {
  return (
    // <AppTheme {...props}>
      <>
          <CssBaseline enableColorScheme />
          <AppAppBar />
          <Hero />
          <div>
            <LogoCollection />
            <Features />
            <Divider />
            <Testimonials />
            <Divider />
            <Highlights />
            <Divider />
            <Pricing />
            <Divider />
            <FAQ />
            <Divider />
            <Footer />
          </div>
      </>
    // </AppTheme>
  );
}
