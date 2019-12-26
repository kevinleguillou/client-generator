import { ENTRYPOINT } from "../config/entrypoint";

export function mercureSubscribe (url: URL, topics: string[]): EventSource {
  topics.forEach(
    topic => url.searchParams.append("topic", String(new URL(topic, ENTRYPOINT))),
  );

  return new EventSource(url.toString());
}

export function normalize<A extends { [key: string]: any; "hydra:member"?: A[]; }> (data: A): A {
  if (data["hydra:member"]) {
    // Normalize items in collections
    data["hydra:member"] = data["hydra:member"].map(item => normalize(item));

    return data;
  }

  // Flatten nested documents
  return Object
    .entries(data)
    .reduce(
      (a, [key, value]) => {
        a[key] = Array.isArray(value)
          ? value.map(v => v && v["@id"] ? v["@id"] : v)
          : value && value["@id"] ? value["@id"] : value;

        return a;
      },
      {} as any,
    );
}

export function extractHubURL (response: Response) {
  const linkHeader = response.headers.get("Link");
  if (!linkHeader) {
    return null;
  }

  const matches = linkHeader.match(
    /<([^>]+)>;\s+rel=(?:mercure|"[^"]*mercure[^"]*")/,
  );

  return matches && matches[1] ? new URL(matches[1], ENTRYPOINT) : null;
}

export function normalizeLinks (value: string | string[] | undefined): string[] {
  if (!value) {
    return [];
  }

  if (typeof value === "string") {
    return value.split(",");
  }

  return value;
}
