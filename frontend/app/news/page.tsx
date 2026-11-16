import NewsList from "@/components/NewsList";

export const metadata = { title: "News and Alerts | Sri Raghavendra Granthalaya" };

export default function NewsPage() {
  return (
    <div className="page">
      <h1>News and Alerts</h1>
      <NewsList />
    </div>
  );
}
