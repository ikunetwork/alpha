export default function getLogs(filter) {
  return new Promise((resolve, reject) => {
    filter.get((error, events) => {
      if (error) return reject(error);
      resolve(events);
    });
  });
}

