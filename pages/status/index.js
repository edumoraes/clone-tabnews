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
      <DatabaseInfo />
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
    </>
  );
}

function DatabaseInfo() {
  const { isLoading, data } = useSWR("/api/v1/status", fetchAPI, {
    refreshInterval: 2000,
  });

  let dbVersion = "Carregando...";
  let maxConnections = "Carregando...";
  let openedConnections = "Carregando";

  if (!isLoading && data) {
    dbVersion = data.dependencies.database.version;
    maxConnections = data.dependencies.database.max_connections;
    openedConnections = data.dependencies.database.opened_connections;
  }

  return (
    <>
      <h2>Database</h2>
      <div>Versão do banco: {dbVersion}</div>
      <div>Conexões máximas: {maxConnections}</div>
      <div>Conexões em uso: {openedConnections}</div>
    </>
  );
}
