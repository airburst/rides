// Work in progress
const jsonOptions = {
  headers: {
    "Content-Type": "application/json",
  },
};

const matchOptions = {
  ignoreSearch: true,
  ignoreMethod: true,
  ignoreVary: true,
};

export const useCache = async () => {
  const cache = await caches.open("rides-app");
  const response = await fetch(
    "https://bcc-psi.vercel.app/api/rides",
    jsonOptions,
  );

  await cache.put("all-rides", response);

  return true;
};

// Get
export const getCache = async () => {
  try {
    const cache = await caches.open("rides-app");
    const response = await cache.match("all-rides", matchOptions);

    return response ? response.json() : null;
  } catch (error) {
    console.error(error);
    return error;
  }
};

// const cacheAvailable = 'caches' in self;
// cache.put("test", new Response("Mark's test"))
// cache.match("test").then(r => r.text()).then(console.log)
