import useSWR from "swr";

async function fetchAPI(key) {
  const response = await fetch(key);
  const responseBody = await response.json();
  return responseBody;
}

export default function StatusPage() {
  return (
    <>
      <h1>Status</h1>
      <UpdatedAt />
    </>
  );
}

function UpdatedAt() {
  const { isLoading, data } = useSWR("/api/v1/status", fetchAPI, {
    refreshInterval: 2000,
  });

  let updatedAt = "Carregando...";

  if (!isLoading && data) {
    updatedAt = new Date(data.updated_at).toLocaleString("pt-BR");
  }

  return (
    <>
      <div>Útima atualização: {updatedAt}</div>
      <div>Versão do banco: {data.dependencies.database.version}</div>
      <div>Conexões máximas: {data.dependencies.database.max_connections}</div>
      <div>
        Conexões em uso: {data.dependencies.database.opened_connections}
      </div>
    </>
  );
}
