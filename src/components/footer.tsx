const Footer = () => {

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth"
    });
  };

  return (
    <footer className="footer">
      <button className="footer-top" onClick={scrollToTop}>
        ↑
      </button>
    </footer>
  );
};

export default Footer;