export const userLogin = (data: any, onSuccess?: any, onError?: any) => {
  fetch("http://localhost:3000/api/login", {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  })
    .then(function (response) {
      if (!response.ok) {
        throw new Error();
      }
      return response.json();
    })
    .then(function (data) {
      const { token } = data;
      // cookie.set('token', token);
      onSuccess(token);
    })
    .catch(function (error) {
      // console.error('Error:', error);
      if (onError) {
        onError(error);
      }
    });
};
