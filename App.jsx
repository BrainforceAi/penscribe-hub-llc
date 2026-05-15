// App.jsx — route table and mount.
function NotFoundPage() {
  return (
    <section className="page-404">
      <div className="container-narrow">
        <h1>Page not found.</h1>
        <p>That URL did not match anything here.</p>
        <a href="#/" className="btn btn-secondary" style={{marginTop: 24}}>Back to home</a>
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
    case 'home':            page = React.createElement(HomePage); break;
    case 'about':           page = React.createElement(AboutPage); break;
    case 'services':        page = React.createElement(ServicesPage); break;
    case 'service-detail':  page = React.createElement(ServiceDetailPage, { slug: route.slug }); break;
    case 'contracts':       page = React.createElement(ContractsPage); break;
    case 'contract-detail': page = React.createElement(ContractDetailPage, { slug: route.slug }); break;
    case 'contact':         page = React.createElement(ContactPage); break;
    default:                page = React.createElement(NotFoundPage);
  }

  React.useEffect(() => {
    setTimeout(() => { if (window.lucide) window.lucide.createIcons(); }, 0);
  }, [hash]);

  return React.createElement(
    React.Fragment, null,
    React.createElement(Nav),
    React.createElement('main', null, page),
    React.createElement(Footer),
    React.createElement(BookingModal)
  );
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(React.createElement(App));
