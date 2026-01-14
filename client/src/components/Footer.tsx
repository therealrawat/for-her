export const Footer = () => {

  return (
    <footer className="mt-12 border-t border-gray-200 text-center text-gray-600 text-sm">
      <div className="max-w-7xl mx-auto px-6 sm:px-8 py-8 sm:py-12">
        <p className="text-center text-sm text-gray-500 font-light">
          © {new Date().getFullYear()} <span style={{ fontWeight: 'bold' }}>4Her</span> by{' '}
          <a
            href="https://www.priyanshurawat.co.in"
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 hover:underline"
          >
            Priyanshu Rawat
          </a>
          . All rights reserved.
        </p>
      </div>

    </footer>
  );
};
