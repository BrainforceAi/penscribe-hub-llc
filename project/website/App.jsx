// App.jsx — route table + mount.
function NotFoundPage() {
  return (
    <section className="page-404">
      <div className="container-narrow">
        <h1>Page not found.</h1>
        <p>That URL did not match anything I have here.</p>
        <a href="#/" className="btn btn-secondary" style={{marginTop: 24}}>← Back to home</a>
      </div>
    </section>
  );
}
window.NotFoundPage = NotFoundPage;

function App() {
  const hash = useHashRoute();
  const route = parseRoute(hash);

  let page;
  switch (route.name) {
    case 'home': page = <HomePage />; break;
    case 'about': page = <AboutPage />; break;
    case 'services': page = <ServicesPage />; break;
    case 'service-detail': page = <ServiceDetailPage slug={route.slug} />; break;
    case 'contracts': page = <ContractsPage />; break;
    case 'contract-detail': page = <ContractDetailPage slug={route.slug} />; break;
    case 'contact': page = <ContactPage />; break;
    default: page = <NotFoundPage />;
  }

  // Re-init lucide on every route change
  React.useEffect(() => {
    setTimeout(() => { if (window.lucide) window.lucide.createIcons(); }, 0);
  }, [hash]);

  return (
    <React.Fragment>
      <Nav />
      <main>{page}</main>
      <Footer />
      <BookingModal />
    </React.Fragment>
  );
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App />);
