import React from 'react';

const Footer = () => {
  return (
    <footer style={footerStyle}>
      <div>
        <p style={textStyle}>Disclaimer: This website is intended for personal use only and is not for commercial purposes.</p>
      </div>
      <div style={contentStyle}>
        <p>Github Link: </p>
        <a href="https://github.com/GrantWass" style={linkStyle}>https://github.com/GrantWass</a>
      </div>
    </footer>
  );
};

const footerStyle = {
  backgroundColor: '#333',
  color: '#f4f4f4',
  textAlign: 'center',
  position: 'fixed',
  left: 0,
  bottom: 0,
  width: '100%',
  display: 'flex',
  justifyContent: 'space-between',
  padding: '0.1rem',
};

const textStyle = {
  margin: 0,
  marginLeft: 5
};

const linkStyle = {
  color: '#f4f4f4',
  textDecoration: 'none',
  marginRight: 5
};

const contentStyle = {
    display: 'flex',
    alignItems: 'center',
    gap: '5px'
  };

export default Footer;
