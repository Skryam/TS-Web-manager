export default function Footer() {
  return (
    <footer className="bg-dark text-light py-3 mt-auto">
      <div className="container text-center">
        <span>© {new Date().getFullYear()} WebManager</span>
      </div>
    </footer>
  );
}
