import React from 'react';
import AppBar from '../appbar/Appbar';
import Footer from '../footer/Footer';

export default function Layout({children}) {
  return (
    <div className="layout">
      {/* {window.location.pathname !== '/release-notes' && (
        <AppBar user={user} signOut={signOut} />
      )} */}

      <div className="content" style={{marginTop: '45px'}}>
        {children}
      </div>

      <div>{window.location.pathname !== '/release-notes' && <Footer />}</div>
    </div>
  );
}
