export default function Footer() {
  return (
    <footer className="bg-dark text-light py-3 mt-5">
      <div className="container text-center">
        <span>© {new Date().getFullYear()} WebManager</span>
      </div>
    </footer>
  );
}
