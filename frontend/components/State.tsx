/** Loading / error placeholder shown while client-side data arrives. */
export default function State({ error }: { error?: string }) {
  return <p className={error ? "state state-error" : "state"} role="status">{error ?? "Loading..."}</p>;
}
