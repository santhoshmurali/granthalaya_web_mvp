import ShrineList from "@/components/ShrineList";

export const metadata = { title: "Shrines | Sri Raghavendra Granthalaya" };

export default function ShrinesPage() {
  return (
    <div className="page">
      <h1>The Shrines of Sri Raghavendra Granthalaya and Their Glory</h1>
      <p className="lead">Built on the foundation of ancient sacred works, sustained by the propagation of those works, and destined to grow still further.</p>
      <ShrineList />
    </div>
  );
}
