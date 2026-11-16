import Link from "next/link";

export default function Footer() {
  return (
    <footer className="site-footer">
      <p className="footer-mantra">Our Granthalaya shall be like Mantralayam; within Granthalaya there shall be a Mantralayam.</p>
      <p className="footer-links">
        Sri Raghavendra Granthalaya, near Poondi Lake, Tiruvallur &middot;{" "}
        <Link href="/admin/">Content Manager</Link>
      </p>
    </footer>
  );
}
