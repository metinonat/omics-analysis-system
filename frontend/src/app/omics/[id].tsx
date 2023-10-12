import { useRouter } from "next/router";

export default function geneDetail() {
  const { id } = useRouter().query;
  return (
    <div>
      <h1>Gene ID: {id}</h1>
    </div>
  );
}
