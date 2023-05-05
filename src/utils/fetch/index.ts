export interface PostOptions {
  headers?: HeadersInit;
  variables?: Record<string, any>;
}

export interface PostError {
  message?: string;
  [key: string]: any;
}

type DefaultFetchResult<T> = {} & T;

export const postFetch = async <FetchResult>(
  queryString: string,
  options?: PostOptions,
) => {
  interface PostResult {
    data?: DefaultFetchResult<FetchResult>;
    error?: PostError;
  }

  const { headers, variables } = options || {};

  try {
    const queryHeaders = {
      "Content-Type": "application/x-www-form-urlencoded",
      ...headers,
    };
    const queryBody = JSON.stringify({
      ...variables,
    });

    const response = await fetch(queryString, {
      method: "POST",
      headers: queryHeaders,
      body: queryBody,
      cache: "no-cache",
    });

    const result = await response.json();

    if (result.bad_token) {
      localStorage.setItem("token", "");
    }
    const newToken = result.new_token || result.login_token;
    if (newToken) {
      localStorage.setItem("token", newToken);
    }

    const postResult = {} as PostResult;
    if (result?.success) postResult.data = result;
    else postResult.error = result;

    return postResult;
  } catch (error) {
    const message = error || "Something went wrong";

    return { error: { message } } as PostResult;
  }
};

export const getFetch = async <FetchResult>(queryString: string) => {
  interface Result {
    data?: DefaultFetchResult<FetchResult>;
    error?: PostError;
  }

  try {
    const response = await fetch(queryString, {
      method: "GET",
    });

    const result = await response.json();

    const postResult = {} as Result;
    postResult.data = result;

    return postResult;
  } catch (error) {
    const message = error || "Something went wrong";

    return { error: { message } } as Result;
  }
};
