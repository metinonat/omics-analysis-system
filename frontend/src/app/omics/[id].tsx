import { useRouter } from "next/router";

export default function GeneDetail() {
  const { id } = useRouter().query;
  return (
    <div>
      <h1>Gene ID: {id}</h1>
    </div>
  );
}
