"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { axiosSecure, axiosPublic } from "@/lib/axios";

/**
 * Standard hook to access the axiosSecure instance
 */
export const useAxiosSecure = () => {
  return axiosSecure;
};

/**
 * Custom TanStack Query mutation hook for posting any data to backend.
 * 
 * Usage examples:
 * 
 * 1) Dynamic endpoint:
 *    const { postData, isPending, error, isSuccess } = usePostData();
 *    // Just call:
 *    await postData('/auth/register', userData);
 * 
 * 2) Predefined endpoint:
 *    const { postData, mutate, isPending } = usePostData('/auth/register');
 *    // Just call:
 *    postData(userData);
 *    // OR TanStack Query mutate:
 *    mutate(userData);
 * 
 * 3) With TanStack Query options (onSuccess, onError):
 *    const { postData } = usePostData({
 *      onSuccess: (data) => console.log('Saved:', data),
 *      onError: (err) => console.error(err),
 *    });
 */
export const usePostData = (endpointOrOptions = null, defaultOptions = {}) => {
  const queryClient = useQueryClient();

  const isEndpointString = typeof endpointOrOptions === "string";
  const defaultUrl = isEndpointString ? endpointOrOptions : null;
  const options = isEndpointString ? defaultOptions : (endpointOrOptions || {});

  const mutation = useMutation({
    mutationFn: async (args) => {
      let targetUrl = defaultUrl;
      let bodyData = args;
      let config = {};
      let isSecure = true;

      // If args was passed as an object: { url, data, isSecure, config }
      if (
        args &&
        typeof args === "object" &&
        ("url" in args || "data" in args)
      ) {
        targetUrl = args.url || targetUrl;
        bodyData = args.data !== undefined ? args.data : args;
        config = args.config || {};
        if (args.isSecure !== undefined) {
          isSecure = args.isSecure;
        }
      }

      if (!targetUrl) {
        throw new Error("Target URL is required to post data.");
      }

      const client = isSecure ? axiosSecure : axiosPublic;
      const response = await client.post(targetUrl, bodyData, config);
      return response.data;
    },
    ...options,
  });

  /**
   * Helper function to post data with a simple call
   * @param {string|object} firstArg - Either the URL string or the payload data
   * @param {object} [secondArg] - The payload data (if firstArg is URL) or options
   */
  const postData = async (firstArg, secondArg, extraOptions) => {
    if (typeof firstArg === "string") {
      return mutation.mutateAsync(
        { url: firstArg, data: secondArg },
        extraOptions
      );
    }
    return mutation.mutateAsync(firstArg, secondArg);
  };

  return {
    ...mutation,
    postData,
    isLoading: mutation.isPending, // TanStack Query v5 alias for convenience
  };
};

export default useAxiosSecure;
