export const Footer = () => {

  return (
    <footer className="mt-10 border-t border-lavender-100 text-center text-gray-600 text-sm bg-white/40 backdrop-blur">
      <div className="max-w-7xl mx-auto px-6 sm:px-8 py-8">
        <p className="text-center text-sm text-gray-500">
          © {new Date().getFullYear()} <span style={{ fontWeight: 'bold' }}>4Her</span> by{' '}
          <a
            href="https://www.priyanshurawat.co.in"
            target="_blank"
            rel="noopener noreferrer"
            className="text-lavender-700 hover:text-lavender-800 hover:underline font-medium"
          >
            Priyanshu Rawat
          </a>
          . All rights reserved.
        </p>
      </div>

    </footer>
  );
};
