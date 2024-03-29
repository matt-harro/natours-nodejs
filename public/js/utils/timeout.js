export const timeout = sec =>
  new Promise((_, reject) => {
    setTimeout(
      () => reject(Error(`Request timed out. Please try again later...`)),
      sec * 1000
    );
  });
